const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: String, 
        required: true,
        unique: true
    },
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true,
        minLength: 6
    },
    role:{
        type: String, 
        required: true
    },
    lastlogin: {
        type: Date
    },
    lastpasswordchange: {
        type: Date
    },
});

const User = mongoose.model('user', userSchema)

module.exports = User;