const mongoose = require("mongoose")
const Music = require('../models/music')

async function showHome(req, res) {
  res.render('pages/home');
}
async function sendMusics(req, res) {
  try {
    const musics = await Music.find({});
    console.log(musics);
    res.send(musics);
  } catch (err) {
    console.error(err);
  }
}

module.exports = { 
   showHome,
   sendMusics,
};
  