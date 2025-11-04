

//import express, and route controllers
const express = require('express');
const router = express.Router();
const { tokenValidator, checkIfAdmin } = require("../middleware/authMiddleware");
const { registerUser, updateUser, deleteUser } = require('../controllers/adminController.js');



//Define routes. 
router.post('/user', tokenValidator, checkIfAdmin, registerUser);

router.put('/user/:id', tokenValidator, checkIfAdmin, updateUser);

router.delete('/user/:id', tokenValidator, checkIfAdmin, deleteUser);



module.exports = router;