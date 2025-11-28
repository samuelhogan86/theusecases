const Appointment = require('../models/appointmentModel');
const User = require('../models/userModel');

// Static: Get all appointments with populated names
async function getAdminDash() {
  return await Appointment.getAdminDash()
}

async function scheduleAppointment(startTime, endTime, doctorId, patientId) {

  if (!startTime || !endTime || !doctorId || !patientId) {
    throw new Error('All fields are required to schedule an appointment');
  }

  const existingDoctor = await User.findOne({ id: doctorId, role: 'doctor' });
  if ( !existingDoctor ) {
    throw new Error('Invalid doctor ID');
  }

  const existingPatient = await User.findOne({ id: patientId, role: 'patient' });
  if ( !existingPatient ) {
    throw new Error('Invalid patient ID');
  }

  if (new Date(startTime) >= new Date(endTime)) {
    throw new Error('Start time must be before end time');
  }

  let isUnique = false;
  let attempts = 0;
  const maxAttemps = 10;
  let appointmentId;
  
  while (!isUnique && attempts < maxAttemps) {

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    appointmentId = `APPT${randomNum}`;

    const existingAppointment = await Appointment.findOne({ appointmentId: appointmentId });
    if (!existingAppointment) {
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique) {
    throw new Error('Failed to generate a unique appointment ID');
  }

  const status = 'active';
  const lastUpdated = new Date();

  const appointmentData = {
    appointmentId,
    startTime,
    endTime,
    doctorId,
    patientId,
    status,
    lastUpdated
  }

  try {
    const appointment = await Appointment.create(appointmentData);
    console.log('Appointment scheduled successfully:', appointment);
    return appointment;
  }
  catch (err) {
    console.error('Error scheduling appointment:', err);
    throw err;
  }

}


module.exports = {getAdminDash, scheduleAppointment}