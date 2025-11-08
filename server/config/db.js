const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

//Mongoose connection works with models lookup utilizing mongoose connection
async function connectDB(){
  try{
    const connection = await mongoose.connect(process.env.MONGODB_URI, {dbName: "theusecases"});
    console.log("Connected to MongoDB with Mongoose");

  }catch(error){
    console.error("Error connecting to MongoDB wtih Mongoose:", error);
    throw error;
  }
}

module.exports = { connectDB };
