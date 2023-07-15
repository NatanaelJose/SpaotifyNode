const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const playlistSchema = new Schema({
    nome: {
      type: String,
    },
    musics: [{
      type: Schema.Types.ObjectId,
      ref: 'Musica',
    }],
  });

const Playlist = mongoose.model("playlist",playlistSchema)

module.exports = Playlist;
