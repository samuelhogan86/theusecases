

//import express, and route controllers
const express = require('express');
const router = express.Router();
const { tokenValidator } = require("../middleware/authMiddleware");
const { registerUser, updateUser, deleteUser } = require('../controllers/adminController.js');



//Define routes. 
router.get('/dashboard')

router.post('/users', tokenValidator, registerUser);

router.put('/users/:id', tokenValidator, updateUser);

router.delete('/users/:id', tokenValidator, deleteUser);



module.exports = router;