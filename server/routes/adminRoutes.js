//import express, and route controllers
const express = require('express');
const router = express.Router();
const { tokenValidator , requireRole} = require("../middleware/authMiddleware");
const { getDash, registerUser, updateUser, deleteUser } = require('../controllers/adminController.js');



//Define routes. 
router.get('/dashboard',tokenValidator,requireRole('admin'), getDash)

//register user
router.post('/users',tokenValidator,requireRole('admin'), registerUser); 

//update user by id
router.put('/users/:id', tokenValidator,requireRole('admin'), updateUser);

//delete user by id
router.delete('/users/:id', tokenValidator,requireRole('admin'), deleteUser);

//get user by id (allow for search get request from front end.)


//get appointments and admin cruds

//get appointment by user ID



module.exports = router;