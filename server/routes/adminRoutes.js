

//import express, and route controllers
const express = require('express');
const router = express.Router();
const { tokenValidator , requireRole} = require("../middleware/authMiddleware");
const { getUsers, registerUser, updateUser, deleteUser } = require('../controllers/adminController.js');



//Define routes. 
router.get('/users',tokenValidator,requireRole('admin'), getUsers)

//register user
router.post('/users',tokenValidator,requireRole('admin'), registerUser); 

//update user by id
router.put('/users/:id', tokenValidator,requireRole('admin'), updateUser);

//delete user by id
router.delete('/users/:id', tokenValidator,requireRole('admin'), deleteUser);

//get user by id (allow for search get request from front end.)


//get appointments and admin cruds


module.exports = router;