const express = require('express');
const router = express.Router();
const pagesController = require('../controllers/Pages');

router.get('/', pagesController.showHome);
router.get('/api', pagesController.sendMusics);
router.get('/login', pagesController.showLogin);
router.get('/register', pagesController.showRegister);
router.post('/register', pagesController.registerAcc);
module.exports = router;