//Login Authentication Endpoints
const authController = require('../controllers/authController');
//Importing express
const express = require('express');
const router = express.Router();

//Importing controllers, handles logic for routes (business logic)
const { loginUser, registerUser } = require('../controllers/authController');

//middleware can go here


//Login Route, post request, hash pass, check db, return token
router.post('/login', loginUser);

//Register Route, post request, hash pass, store in db, return token
router.post('/register', registerUser);

module.exports = router;