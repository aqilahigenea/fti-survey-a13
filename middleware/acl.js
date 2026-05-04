const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    next(); // role admin, lanjut
  } else {
    res.status(403).send('Akses ditolak. Halaman ini hanya untuk admin.');
  }
};

module.exports = isAdmin;