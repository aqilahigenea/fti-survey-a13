const db     = require('../config/db');
const bcrypt = require('bcrypt');

// ── Tampil Login ─────────────────────────────────────────────
exports.tampilLogin = (req, res) => {
  if (req.session.user) {
    return req.session.user.role === 'admin'
      ? res.redirect('/admin/dashboard')
      : res.redirect('/survey');
  }
  const pesan = req.query.error || null;
  const sukses = req.query.success || null;
  res.render('auth/login', { pesan, sukses });
};

// ── Proses Login ─────────────────────────────────────────────
exports.prosesLogin = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.redirect('/login?error=empty');
  }

  db.query('SELECT * FROM users WHERE username = ?', [username],
    async (err, results) => {
      if (err)                  return res.redirect('/login?error=server');
      if (results.length === 0) return res.redirect('/login?error=notfound');

      const user  = results[0];
      const cocok = await bcrypt.compare(password, user.password);
      if (!cocok) return res.redirect('/login?error=wrongpass');

      req.session.user = {
        id:       user.id,
        username: user.username,
        role:     user.role
      };

      user.role === 'admin'
        ? res.redirect('/admin/dashboard')
        : res.redirect('/survey');
    }
  );
};

// ── Tampil Register ──────────────────────────────────────────
exports.tampilRegister = (req, res) => {
  if (req.session.user) {
    return req.session.user.role === 'admin'
      ? res.redirect('/admin/dashboard')
      : res.redirect('/survey');
  }
  const pesan = req.query.error || null;
  res.render('auth/register', { pesan });
};

// ── Proses Register ──────────────────────────────────────────
exports.prosesRegister = (req, res) => {
  const { username, password, konfirmasi } = req.body;

  if (!username || !password || !konfirmasi)
    return res.redirect('/register?error=empty');

  if (password !== konfirmasi)
    return res.redirect('/register?error=mismatch');

  if (password.length < 6)
    return res.redirect('/register?error=short');

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.redirect('/register?error=server');

    db.query(
      'INSERT INTO users (username, password, role) VALUES (?, ?, "user")',
      [username, hash],
      (err) => {
        if (err) return res.redirect('/register?error=exists');
        res.redirect('/login?success=registered');
      }
    );
  });
};

// ── Logout ───────────────────────────────────────────────────
exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};
