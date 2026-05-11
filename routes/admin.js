const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/adminController');
const isLoggedIn = require('../middleware/auth');
const { isAdmin } = require('../middleware/acl');

// Admin: dashboard (Tahap 1 — placeholder)
router.get('/dashboard', isLoggedIn, isAdmin, controller.dashboard);

module.exports = router;
