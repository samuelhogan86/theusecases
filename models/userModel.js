const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: Number, //not sure if this should be something else
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
        type: String, //not sure if this should be something else
        required: true,
        minLength: 6
    },
    role:{
        type: String, //not sure if this should be something else
        required: true
    },
    lastlogin: {
        type: Date
    },
    lastpassword: {
        type: Date
    },
});

const User = mongoose.model('user')