const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db(); 
  } 
  catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

module.exports = { connectDB };
