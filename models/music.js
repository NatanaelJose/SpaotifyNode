const mongoose = require('mongoose');
const { Schema } = mongoose;

const music = new Schema({
    name: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  });
  
const Music = mongoose.model('musics', music);

module.exports = Music;