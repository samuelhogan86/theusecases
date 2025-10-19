// testConnection to DB with mongoose
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected successfully'))
  .catch(err => console.error('Connection failed:', err.message));