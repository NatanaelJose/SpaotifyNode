const mongoose = require('mongoose')
require('dotenv').config()

const main = async function main() {
  mongoose.Promise = global.Promise;
  await mongoose.connect(`mongodb+srv://dbUser:${process.env.USER}@cluster0.a7u9nzk.mongodb.net/Songs?retryWrites=true&w=majority`, {
    //useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() =>{
    console.log("MongoDB conectado...");
  }).catch((err)=>{
    console.log("Houve um erro ao se conectar com  o mongoDB: "+err)
  })
}
main();

module.exports = main;
