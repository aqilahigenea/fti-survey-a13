const express          = require('express');
const router           = express.Router();
const adminController  = require('../controllers/adminController');
const isLoggedIn       = require('../middleware/auth');
const isAdmin          = require('../middleware/acl');

// Semua route admin wajib login + role admin
router.use(isLoggedIn, isAdmin);

// Dashboard
router.get('/dashboard', adminController.dashboard);

// Lihat hasil survey
router.get('/survey/:id/hasil', adminController.hasilSurvey);

// Export PDF
router.get('/survey/:id/export/pdf', adminController.exportPdf);

// Export CSV
router.get('/survey/:id/export/csv', adminController.exportCsv);

module.exports = router;