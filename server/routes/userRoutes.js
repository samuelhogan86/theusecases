const express = require('express');
const router = express.Router();
const { tokenValidator , requireRole} = require("../middleware/authMiddleware");
const {getUserDash, cancelAppointment} = require("../controllers/userController");


// Doctors only have 'view' permissions for appointments
// patients have 'view' and 'cancel'
// Admins have all permissions


//Get user dashboard information, must be associated user
router.get('/:UserId/dashboard', tokenValidator, getUserDash);


//cancel an appointment, must be patient
router.delete('/:AppointmentId', tokenValidator, requireRole('patient'), cancelAppointment);

//