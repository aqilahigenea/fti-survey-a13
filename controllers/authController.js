const db     = require('../config/db');
const bcrypt = require('bcrypt');

// ── Tampil Login ─────────────────────────────────────────────
exports.tampilLogin = (req, res) => {
  if (req.session.user) {
    return req.session.user.role === 'admin'
      ? res.redirect('/admin/dashboard')
      : res.redirect('/survey');
  }
  const pesan  = req.query.error   || null;
  const sukses = req.query.success || null;
  res.render('auth/login', { pesan, sukses });
};

// ── Proses Login ─────────────────────────────────────────────
exports.prosesLogin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.redirect('/login?error=empty');
  }

  db.query(
    `SELECT u.*, r.name as role 
     FROM users u
     LEFT JOIN model_has_roles mhr ON mhr.model_id = u.id
     LEFT JOIN roles r ON r.id = mhr.role_id
     WHERE u.email = ?`,
    [email],
    async (err, results) => {
      if (err)                  return res.redirect('/login?error=server');
      if (results.length === 0) return res.redirect('/login?error=notfound');

      const user  = results[0];
      const cocok = await bcrypt.compare(password, user.password);
      if (!cocok) return res.redirect('/login?error=wrongpass');

      req.session.user = {
        id:    user.id,
        name:  user.name,
        email: user.email,
        role:  user.role
      };

      user.role === 'admin'
        ? res.redirect('/admin/dashboard')
        : res.redirect('/survey');
    }
  );
};

// ── Logout ───────────────────────────────────────────────────
exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};