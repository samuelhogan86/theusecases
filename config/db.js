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
    return client.db("HealthPortal"); 
  }catch(error){
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}


//# Native MongoDB connection, error trying to query from mongoose connection since models setup on mongoose
// async function connectDB() {
//   try {
//     await client.connect();
//     console.log("Connected to MongoDB");
//     return client.db("HealthPortal"); 
//   } 
//   catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//     throw error;
//   }
// }

module.exports = { connectDB };
