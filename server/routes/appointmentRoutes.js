const express = require('express');
const router = express.Router();
const { tokenValidator , requireRole} = require("../middleware/authMiddleware");
const {getUserDash, cancelAppointment} = require("../controllers/appointmentController");


//cancel an appointment, must be patient
router.delete('/:AppointmentId', tokenValidator, requireRole('patient'), cancelAppointment);