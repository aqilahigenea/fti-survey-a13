// Middleware ACL: cek role user
// isAdmin  → hanya admin yang boleh akses
// isUser   → hanya user biasa yang boleh akses

const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else if (!req.session.user) {
    res.redirect('/login');
  } else {
    res.redirect('/survey'); // user biasa tidak boleh akses admin
  }
};

const isUser = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'user') {
    next();
  } else if (!req.session.user) {
    res.redirect('/login');
  } else {
    res.redirect('/admin/dashboard'); // admin tidak perlu halaman survey user
  }
};

module.exports = { isAdmin, isUser };
