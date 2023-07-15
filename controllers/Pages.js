const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Playlist = require('../models/playlist')
const Music = require('../models/music');
const User = require('../models/users');

async function showHome(req, res) {
    if(req.session.user) {
        let cred = {};
        if(req.session.user.admin){
            cred["admin"] = 1
        }
        let nome = req.session.user.nome;
        cred["nome"] = nome;
        res.render('pages/home', {cred:cred})
    } else {
        res.render('pages/home');
    }
}

async function showRegister(req, res) {
  res.render('pages/register', {layout: 'users', namePage: 'Register',})
}

async function showLogin(req,res){
  res.render('pages/login', {layout:'users', namePage: 'Login',});
}

async function registerAcc(req, res) {
    const email = req.body.email
    const nome = req.body.nome
    let senha1 = req.body.senha1
    const senha2 = req.body.senha2

    if (email == ""|| email == undefined || email == null) {
        req.flash("error_msg", "Email em branco ou inválido")
        res.redirect('/register')
    } else if (senha1 == ""|| senha1 == undefined || senha1 == null) {
        req.flash("error_msg", "Senha em branco ou inválida")
        res.redirect('/register')
    } else if (senha2 == ""|| senha2  == undefined || senha2 == null) {
        req.flash("error_msg", "Senha de confirmação em branco ou inválida")
        res.redirect('/register')       
    } else {
        //checar se já existe esse email
        if (senha1 != senha2) {
            req.flash("error_msg", "As senhas não batem")
            res.redirect('/register') 
        } else {
            User.findOne({ email: email }).then((data) => {
                    if (data) {
                        req.flash("error_msg", "Este email já foi utilizado")
                        res.redirect("/register")
                    }  else {
                        //encryptar senha
                        bcrypt.genSalt(10, (erro, salt) => {
                            bcrypt.hash(senha1, salt, (erro, hash) => {
                                if (erro) {
                                    req.flash("error_msg", "Erro no salvamento")
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
                                    req.flash("success_msg", "Conta criada com sucesso, faça seu login!")
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

async function Login(req, res){
  let email = req.body.email
    let senha1 = req.body.senha1

    if (email == ""|| email == undefined || email == null) {
        req.flash("error_msg", "Email em branco ou inválido ")
        res.redirect('/login')
    } else if (senha1 == ""|| senha1 == undefined || senha1 == null) {
        req.flash("error_msg", " senha em branco ou inválida")
        res.redirect('/login')
    } else {
        User.findOne({ email: email }).then((data) => {
            if (data) {
                    bcrypt.compare(senha1, data.senha, function(err, result) {
                    if (result) {
                        req.session.user = {}
                        if (data.admin == 1) {
                            req.session.user["admin"] = true
                        }
                        req.session.user.nome = data.nome;
                            req.flash("error_msg", `bem vindo ao spãotify, ${req.session.user.nome}`)
                            console.log(`O usuário ${req.session.user.nome} logou`)
                            res.redirect("/")
                    } else {
                        req.flash("error_msg", "a senha está incorreta")
                        res.redirect("/login")
                    }
                })
                } else {
                    req.flash("error_msg", "esse email não existe")
                    res.redirect("/login")
                }
            }).catch((err)=>{
                req.flash("success_msg", err)
                res.redirect("/login")
            })
}};

async function Logout(req, res){
    let name = req.session.user.nome;
    req.session.user = null;
    req.session.dayData = null;
    req.flash("success_msg", "Deslogado com sucesso");
    console.log(`O usuário ${name} deslogou`);
    res.redirect('/')
}

async function sendMusics(req, res) {
  try {
    const musics = await Music.find({});
    //console.log(musics);
    res.send(musics);
  } catch (err) {
    console.error(err);
  }
};

module.exports = { 
   showHome,
   sendMusics,
   showLogin,
   showRegister,
   registerAcc,
   Login,
   Logout,
};