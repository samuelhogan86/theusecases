//Login Authentication Endpoints
//Importing controllers, handles logic for routes (business logic)
const { loginUser, changeUserPass } = require('../controllers/authController');
const {tokenValidator} = require('../middleware/authMiddleware')
//Importing express
const express = require('express');
const router = express.Router();




//Login Route, post request, hash pass, check db, return token
router.post('/login', tokenValidator, loginUser);



router.post('/change-password', tokenValidator, changeUserPass)

module.exports = router;