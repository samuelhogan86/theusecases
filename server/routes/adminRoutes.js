

//import express, and route controllers
const express = require('express');
const router = express.Router();
const { tokenValidator } = require("../middleware/authMiddleware");
const { dashboard, registerUser, updateUser, deleteUser } = require('../controllers/adminController.js');



//Define routes. 
router.get('/dashboard', dashboard)

//register user
router.post('/users', tokenValidator, registerUser);

//update user by id
router.put('/users/:id', tokenValidator, updateUser);


//delete user by id
router.delete('/users/:id', tokenValidator, deleteUser);



module.exports = router;