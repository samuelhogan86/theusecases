const express = require('express');
const router = express.Router();
const { tokenValidator , requireRole} = require("../middleware/authMiddleware");
const {cancelAppointment, removeAppointment} = require("../controllers/appointmentController");


//cancel an appointment, must be patient
router.patch('/:AppointmentId', tokenValidator, cancelAppointment);

router.delete('/:AppointmentId', tokenValidator, requireRole('admin'), removeAppointment);


//Schedule appointment


//modify appointment