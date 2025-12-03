//Importing 
const express = require('express');
const router = express.Router();
const { tokenValidator, requireRole} = require("../middleware/authMiddleware");
const {getUserDash} = require("../controllers/userController");
const {registerUser, updateUser, deleteUser } = require('../controllers/adminController.js');


// Doctors only have 'view' permissions for appointments
// patients have 'view' and 'cancel'
// Admins have all permissions

router.use(tokenValidator)
//Get user dashboard information, must be associated user
router.get('/dashboard', getUserDash);
//register user
router.post('/', requireRole('admin'), registerUser); 

//update user by id
router.put('/:UserId', requireRole('admin'),updateUser);

//delete user by id
router.delete('/:UserId', requireRole('admin'),deleteUser);



module.exports = router;