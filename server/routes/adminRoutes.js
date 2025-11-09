

//import express, and route controllers
const express = require('express');
const router = express.Router();
const { tokenValidator , checkIfAdmin} = require("../middleware/authMiddleware");
const { dashboard, registerUser, updateUser, deleteUser } = require('../controllers/adminController.js');



//Define routes. 
router.get('/dashboard',checkIfAdmin,tokenValidator, dashboard)

//register user
router.post('/users', checkIfAdmin, tokenValidator, registerUser);

//update user by id
router.put('/users/:id', checkIfAdmin, tokenValidator, updateUser);

//delete user by id
router.delete('/users/:id', checkIfAdmin, tokenValidator, deleteUser);

//get user by id (allow for search get request from front end.)

module.exports = router;