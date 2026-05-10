const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/surveyController');
const isLoggedIn = require('../middleware/auth');
const { isUser } = require('../middleware/acl');

// Pengguna: lihat daftar survey (Tahap 1 — placeholder)
router.get('/', isLoggedIn, isUser, controller.tampilSurvey);

module.exports = router;
