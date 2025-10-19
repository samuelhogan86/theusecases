//Login Authentication Endpoints
//Importing controllers, handles logic for routes (business logic)
const { loginUser, registerUser } = require('../controllers/authController');
//Importing express
const express = require('express');



const router = express.Router();
//middleware can go here


//Login Route, post request, hash pass, check db, return token. Register is handled by Admin.
router.post('/login', loginUser);


module.exports = router;