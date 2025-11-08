//Login Authentication Endpoints
//Importing controllers, handles logic for routes (business logic)
const { loginUser, registerUser, logoutUser } = require('../controllers/authController');
//Importing express
const express = require('express');



const router = express.Router();
//middleware can go here


//Login Route, post request, hash pass, check db, return token
router.post('/login', loginUser);

//Register Route, post request, hash pass, store in db, return token
router.post('/admin/register', registerUser);

router.post('/logout', logoutUser);

module.exports = router;