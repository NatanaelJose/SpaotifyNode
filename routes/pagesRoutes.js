const express = require('express');
const router = express.Router();
const pagesController = require('../controllers/Pages');

router.get('/', pagesController.showHome);
router.get('/api', pagesController.sendMusics);

module.exports = router;