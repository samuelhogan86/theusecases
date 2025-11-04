const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);


//Mongoose connection works with models lookup utilizing mongoose connection
async function connectDB(){
  try{
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    return client.db("theusecases");
    
  }catch(error){
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}


module.exports = { connectDB };
