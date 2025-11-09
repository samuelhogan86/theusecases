

//import express, and route controllers
const express = require('express');
const router = express.Router();
const { tokenValidator , checkIfAdmin} = require("../middleware/authMiddleware");
const { dashboard, registerUser, updateUser, deleteUser } = require('../controllers/adminController.js');



//Define routes. 
router.get('/dashboard', tokenValidator, checkIfAdmin, dashboard)

//register user
router.post('/users', tokenValidator, checkIfAdmin, registerUser);

//update user by id
router.put('/users/:id', tokenValidator, checkIfAdmin, updateUser);

//delete user by id
router.delete('/users/:id', tokenValidator, checkIfAdmin, deleteUser);

module.exports = router;