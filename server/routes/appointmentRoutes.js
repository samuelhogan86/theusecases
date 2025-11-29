const express = require('express');
const router = express.Router();
const { tokenValidator , requireRole} = require("../middleware/authMiddleware");
const {cancelAppointment, removeAppointment} = require("../controllers/appointmentController");


//cancel an appointment, must be patient
router.use(tokenValidator)

router.patch('/:AppointmentId', cancelAppointment); //only patch status

router.delete('/:AppointmentId', requireRole('admin'), removeAppointment);

router.put('/:AppointmentId', requireRole('admin'), modifyAppointment);


module.exports = router;