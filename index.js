require('dotenv').config()
const express = require('express');
const app = express();
const {engine} = require('express-handlebars');
const bodyParser = require('body-parser');
const logger = require('morgan');
const session = require('cookie-session')
const flash = require('connect-flash');
const cors = require('cors');
const handlebars = require('handlebars');
const path = require('path');
const helmet = require('helmet');
const PORT = process.env.PORT || 3000;

//routes
const mongoDB = require('./db/conn');
const pagesRoutes = require('./routes/pagesRoutes');

//flash, session e helmet
app.use(session({
  maxAge:12*60*60*1000,
  secret: process.env.SECRET || 'secret',
  keys: [process.env.KEY1, process.env.KEY2],
  saveUninitialized: true,
}));

const whitelist = ['http://localhost:5000', "https://spaotify.vercel.app"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  next()
})

//view engine setup
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set("views", path.join(__dirname,"views"));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', pagesRoutes);

app.listen(PORT, () => {
  if(PORT === 3000) {
    console.log('Servidor rodando na porta 3000');
  } else {
    console.log('Servidor está rodando')
  }
  });
