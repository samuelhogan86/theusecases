//import express, and route controllers
const express = require('express');
const router = express.Router();
const { tokenValidator , requireRole} = require("../middleware/authMiddleware");
const { getDash, registerUser, updateUser, deleteUser } = require('../controllers/adminController.js');



//Define routes. 
//Dashboard should get, package of info, Patients, Their Appointments, and Doctors associated. 
router.get('/dashboard',tokenValidator,requireRole('admin'), getDash) 

router.get('/user/:UserId', tokenValidator,requireRole('admin')) // get user by ID

router.get('/appointments/:AppointmentId', tokenValidator,requireRole('admin')) //get appointment 

//register user
router.post('/users',tokenValidator,requireRole('admin'), registerUser); 

//update user by id
router.put('/users/:UserId', tokenValidator,requireRole('admin'), updateUser);

//delete user by id
router.delete('/users/:UserId', tokenValidator,requireRole('admin'), deleteUser);

//get user by id, returns user appointments by ID

//modify appointment

//create appointment





module.exports = router;