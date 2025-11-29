const Appointment = require('../models/appointmentModel');
const User = require('../models/userModel');

// Static: Get all appointments with populated names
async function getAdminDash() {
  return await Appointment.getAdminDash()
}
async function cancelService(apptId){
  try{
    const appointment = await Appointment.findOne({appointmentId: apptId});
    appointment.status = 'inactive';
    appointment.lastUpdated = new Date();
    const savedAppointment = await appointment.save();
    return savedAppointment;
  }catch(err){
    console.error("SERVICE, error", err);
    throw err;
  }
}


async function deleteService(apptId){
  try{
    const appointment = await Appointment.deleteOne({appointmentId:apptId});
    return appointment;
  }catch(err){
    console.error("SERVICE, error", err);
    throw err;
  }
}

async function modifyService(apptId, updates){
  try{
    const appointment = await Appointment.findOne({appointmentId:apptId})
    if (!appointment){
      console.log("SERVICE, No appointment found");
      return null;
    }
    //Apply updates and do checks
    console.log(updates);
    let {startTime,endTime,doctorId,patientId,status} = updates;
    if(startTime){
      appointment.startTime = startTime;
    }
    if(endTime){
      appointment.endTime = endTime;
    }
    if(doctorId){
      appointment.doctorId = doctorId;
    }
    if(patientId){
      appointment.patientId = patientId;
    }
    if(status){
      appointment.status = status;
    }
    appointment.lastUpdated = new Date();
    const savedAppointment = await appointment.save();
    return savedAppointment;


  }catch(err){
    console.error("SERVICE, error", err);

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
module.exports = {cancelService, deleteService, modifyService, getAdminDash, scheduleAppointment}

