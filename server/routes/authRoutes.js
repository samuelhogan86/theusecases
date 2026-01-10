//Login Authentication Endpoints
//Importing controllers, handles logic for routes (business logic)
const { loginUser, changePassword } = require('../controllers/authController');
//Importing express
const express = require('express');
const router = express.Router();




//Login Route, post request, hash pass, check db, return token
router.post('/login', loginUser);

// Change password for a user (expects { currentPassword, newPassword })
router.post('/users/:id/change-password', changePassword);

module.exports = router;