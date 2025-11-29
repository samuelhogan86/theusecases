const express = require('express');
const router = express.Router();
const { tokenValidator , requireRole} = require("../middleware/authMiddleware");
const {cancelAppointment, removeAppointment, scheduleAppointment, modifyAppointment} = require("../controllers/appointmentController");


//cancel an appointment, must be patient
router.use(tokenValidator)

router.patch('/:AppointmentId', cancelAppointment); //only patch status

router.delete('/:AppointmentId', requireRole('admin'), removeAppointment);

router.put('/:AppointmentId', requireRole('admin'), modifyAppointment);

//Schedule appointment
router.post('/', requireRole('admin'), scheduleAppointment);  

//modify appointment

module.exports = router;

