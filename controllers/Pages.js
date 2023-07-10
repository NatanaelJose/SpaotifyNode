const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Music = require('../models/music');
const User = require('../models/users');

async function showHome(req, res) {
  res.render('pages/home');
}

async function showLogin(req,res){
  res.render('pages/login', {layout:'users', namePage: 'Login',});
}

async function showRegister(req, res) {
  res.render('pages/register', {layout: 'users', namePage: 'Register',})
}

async function registerAcc(req, res) {
    const email = req.body.email
    const nome = req.body.nome
    let senha1 = req.body.senha1
    const senha2 = req.body.senha2

    if (email == ""|| email == undefined || email == null) {
        req.flash("error_msg", "Email em branco ou inválida")
        res.redirect('/register')
    } else if (senha1 == ""|| senha1 == undefined || senha1 == null) {
        req.flash("error_msg", " senha em branco ou inválida")
        res.redirect('/register')
    } else if (senha2 == ""|| senha2  == undefined || senha2 == null) {
        req.flash("error_msg", " repita a senha ")
        res.redirect('/register')       
    } else {
        //checar se já existe esse email
        if (senha1 != senha2) {
            req.flash("error_msg", " as senhas não batem ")
            res.redirect('/register') 
        } else {
            User.findOne({ email: email }).then((data) => {
                    if (data) {
                        req.flash("error_msg", "esse email já foi utilizado")
                        res.redirect("/register")
                    }  else {
                        //encryptar senha
                        bcrypt.genSalt(10, (erro, salt) => {
                            bcrypt.hash(senha1, salt, (erro, hash) => {
                                if (erro) {
                                    req.flash("error_msg", "erro no salvamento")
                                    res.redirect("/register")
                                }
                                senha1 = hash
                                const newUser = {
                                  nome:nome,
                                  email:email,
                                  senha:senha1,
                                  admin: 0,
                                }
                                new User(newUser).save().then(() => {
                                    req.flash("success_msg", "conta criada com sucesso, agora faça seu login")
                                    res.redirect("/login")
                                }).catch((err)=>{
                                    req.flash("success_msg", err)
                                    res.redirect("/login")
                                })
                        })})
                    }}).catch((err)=>{
                        req.flash("success_msg", err)
                        res.redirect("/login")
                    })
            }
        }
}


async function sendMusics(req, res) {
  try {
    const musics = await Music.find({});
    //console.log(musics);
    res.send(musics);
  } catch (err) {
    console.error(err);
  }
}

module.exports = { 
   showHome,
   sendMusics,
   showLogin,
   showRegister,
   registerAcc,
};
  