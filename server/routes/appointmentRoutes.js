const express = require('express');
const router = express.Router();
const { tokenValidator , requireRole} = require("../middleware/authMiddleware");
const { scheduleAppointment } = require("../controllers/appointmentController");


//cancel an appointment, must be patient
//router.delete('/:AppointmentId', tokenValidator, requireRole('patient'), cancelAppointment);

//Delete appointment, must be admin

//Schedule appointment
router.post('/', tokenValidator, requireRole('admin'), scheduleAppointment);  

//modify appointment

module.exports = router;
