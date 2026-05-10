const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/authController');

router.get('/',          (req, res) => res.redirect('/login'));
router.get('/login',     controller.tampilLogin);
router.post('/login',    controller.prosesLogin);
router.get('/register',  controller.tampilRegister);
router.post('/register', controller.prosesRegister);
router.get('/logout',    controller.logout);

module.exports = router;
