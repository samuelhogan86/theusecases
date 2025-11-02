

//import express, and route controllers
const express = require('express');
const router = express.Router();
const { registerUser, updateUser, deleteUser } = require('../controllers/adminController.js');



//Define routes. 
router.post('/user', registerUser);

router.put('/user/:id', updateUser);

router.delete('/user/:id', deleteUser);



module.exports = router;