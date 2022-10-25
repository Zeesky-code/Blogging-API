const mongoose = require('mongoose');
require('dotenv').config()

const MONGO_DB_CONNECTION_URI = process.env.MONGO_DB_CONNECTION_URI

function connectToMongoDB(){
    mongoose.connect(MONGO_DB_CONNECTION_URI);
    
    mongoose.connection.on("connected",()=>{
        console.log("Connection to MongoDB is successful")
    })

    mongoose.connection.on("error",(err)=>{
        console.log(err)
        console.log("An error occured.")
    })
}

module.exports={connectToMongoDB}