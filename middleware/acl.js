const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else if (!req.session.user) {
    res.redirect('/login');
  } else {
    res.redirect('/survey');
  }
};

const isUser = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'user') {
    next();
  } else if (!req.session.user) {
    res.redirect('/login');
  } else {
    res.redirect('/admin/dashboard');
  }
};

module.exports = { isAdmin, isUser };