//import express, and route controllers
const express = require('express');
const router = express.Router();
const { tokenValidator , requireRole} = require("../middleware/authMiddleware");
const { getDash, registerUser, updateUser, deleteUser } = require('../controllers/adminController.js');



//Define routes. 
//Dashboard should get, package of info, Patients, Their Appointments, and Doctors associated. 
router.get('/dashboard',tokenValidator,requireRole('admin'), getDash) 

router.get('/user/:id', tokenValidator,requireRole('admin')) // get user by ID

router.get('/appointments/:id', tokenValidator,requireRole('admin')) //get appointment with userID

//register user
router.post('/users',tokenValidator,requireRole('admin'), registerUser); 

//update user by id
router.put('/users/:id', tokenValidator,requireRole('admin'), updateUser);

//delete user by id
router.delete('/users/:id', tokenValidator,requireRole('admin'), deleteUser);

//get user by id, returns user appointments by ID

//modify appointment

//create appointment





module.exports = router;