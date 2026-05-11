// Controller Admin — Tahap 1
// Hanya dashboard placeholder, fitur lengkap di Tahap 2

exports.dashboard = (req, res) => {
  res.render('admin/dashboard', {
    user: req.session.user
  });
};
