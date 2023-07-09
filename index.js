const express = require('express');
const app = express();
const {engine} = require('express-handlebars');
const bodyParser = require('body-parser');

const mongoDB = require('./db/conn');
const pagesRoutes = require('./routes/pagesRoutes');

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set("views", "./views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(express.json())

app.use(express.static('public'))

app.use('/', pagesRoutes);

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
  });

/**
const Music = require("../../models/music")
const mongoose = require("mongoose")
Music.find({})
    .then(Musics => {
      console.log(Musics);
      mongoose.connection.close(); // Fechar a conexão após a consulta
    })
    .catch(err => {
      console.error(err);
    }); **/