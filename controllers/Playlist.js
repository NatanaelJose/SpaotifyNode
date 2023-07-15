const mongoose = require("mongoose");
const Playlist = require('../models/playlist')
const Music = require('../models/music');
const User = require('../models/users');

async function searchArtists(req, res) {
    try {
      const artists = await Music.distinct('artist');
      return artists;
      } catch (err){
      console.error('Erro ao pesquisar artistas:', err);
    }
}

async function artistsPlaylist(req, res) {
    try{
        let artists = await searchArtists();
        for (const artist of artists) {
            await createPlaylist(artist);
          }
    } catch(err){
        console.log(err);
    }
}

async function createPlaylist(artist) {
    const nomePlaylist = artist;
    try {
      let playlist = await Playlist.findOne({ nome: nomePlaylist });
      if (playlist) {
        // Se a playlist já existe, atualiza com novos IDs de músicas
        const resultados = await Music.find({ artist: nomePlaylist }).select('_id');
        const musicas = await Music.find({ _id: { $in: resultados } });
        const newMusicIds = musicas.map(result => result._id);
  
        // Filtra os IDs das músicas que já existem na playlist
        const uniqueMusicIds = newMusicIds.filter(id => !playlist.musics.includes(id));
  
        playlist.musics.push(...uniqueMusicIds); // Adiciona apenas os IDs de músicas únicos
        playlist = await playlist.save(); // Salva a playlist atualizada
        console.log('Playlist atualizada:', playlist);
      } else {
        // Se a playlist não existe, cria uma nova
        playlist = new Playlist({ nome: nomePlaylist });
        const resultados = await Music.find({ artist: nomePlaylist }).select('_id');
        const musicas = await Music.find({ _id: { $in: resultados } });
        playlist.musics = musicas;
        playlist = await playlist.save();
        console.log('Playlist criada:', playlist);
      }
    } catch (erro) {
      console.error('Erro ao criar/atualizar a playlist:', erro);
    }
}

module.exports = {
    artistsPlaylist,
}