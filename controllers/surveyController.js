// Controller Survey — Tahap 1
// Hanya halaman awal placeholder, fitur lengkap di Tahap 2

exports.tampilSurvey = (req, res) => {
  res.render('survey/index', {
    user: req.session.user
  });
};
