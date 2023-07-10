const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const user = new Schema({
    nome: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    senha:{
        type: String,
        require:true
    },
    admin:{
        type: Number,
        default: 0
    }
})

const User = mongoose.model("User",user)

module.exports = User;
