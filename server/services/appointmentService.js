const Appointment = require('../models/appointmentModel');

// Static: Get all appointments with populated names
async function getAdminDash() {
  return await Appointment.getAdminDash()
}

module.exports = {getAdminDash}
