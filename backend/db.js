const mongoose = require('mongoose');
const mongoURI ="mongodb+srv://khushbakht334:Mamapapa123_4@cluster0.xazaocr.mongodb.net/test?authSource=+Cluster0&authMechanism=SCRAM-SHA-1"
const connectToMongo = async () => {
    mongoose.connect(mongoURI, await console.log("Connected to mongo `Successful")
    );
   }
module.exports = connectToMongo;