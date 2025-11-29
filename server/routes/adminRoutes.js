//import express, and route controllers
const express = require('express');
const router = express.Router();
const { tokenValidator , requireRole} = require("../middleware/authMiddleware");
const { getDash, registerUser, updateUser, deleteUser } = require('../controllers/adminController.js');



//Define routes. 
router.use(tokenValidator, requireRole('admin'));
//Dashboard should get, package of info, Patients, Their Appointments, and Doctors associated. 
router.get('/dashboard', getDash) 

//register user
router.post('/users', registerUser); 

//update user by id
router.put('/users/:UserId', updateUser);

//delete user by id
router.delete('/users/:UserId', deleteUser);



module.exports = router;