//Login Authentication Endpoints
//Importing controllers, handles logic for routes (business logic)
const { loginUser, logoutUser, changeUserPass } = require('../controllers/authController');
const {tokenValidator} = require('../middleware/authMiddleware')
//Importing express
const express = require('express');
const router = express.Router();




//public routes
router.post('/login', loginUser);

//protected routes
router.post('/logout', tokenValidator, logoutUser);
router.post('/change-password', tokenValidator, changeUserPass)

module.exports = router;