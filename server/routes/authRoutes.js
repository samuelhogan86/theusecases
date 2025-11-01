//Login Authentication Endpoints
//Importing controllers, handles logic for routes (business logic)
const { loginUser } = require('../controllers/authController');
//Importing express
const express = require('express');
const router = express.Router();




//Login Route, post request, hash pass, check db, return token
router.post('/login', loginUser);



module.exports = router;