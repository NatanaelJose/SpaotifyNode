const express = require('express');
const router = express.Router();
const pagesController = require('../controllers/Pages');
const playlistController = require('../controllers/Playlist');

//playlistController.artistsPlaylist();
//pagesController.createPlaylist()
router.get('/', pagesController.showHome);
router.get('/api', pagesController.sendMusics);
router.get('/register', pagesController.showRegister);
router.post('/register', pagesController.registerAcc);
router.get('/login', pagesController.showLogin);
router.post('/login', pagesController.Login)
router.get('/logout', pagesController.Logout)

module.exports = router;