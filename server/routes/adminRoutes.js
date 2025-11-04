

//import express, and route controllers
const express = require('express');
const router = express.Router();
const { tokenValidator } = require("../middleware/authMiddleware");
const { registerUser, updateUser, deleteUser } = require('../controllers/adminController.js');



//Define routes. 
router.post('/user', tokenValidator, registerUser);

router.put('/user/:id', tokenValidator, updateUser);

router.delete('/user/:id', tokenValidator, deleteUser);



module.exports = router;