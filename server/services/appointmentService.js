const { stat } = require('fs');
const Appointment = require('../models/appointmentModel');
const User = require('../models/userModel');

// Static: Get all appointments with populated names
async function cancelService(apptId, userId){
  try{
    console.log(`SERVICE, Searching for: ${apptId} by user: ${userId}`);
    apptId = apptId.trim();
    const appointment = await Appointment.findOne({appointmentId: apptId});
    console.log(appointment);
    console.log("SERVICE, doctorId type:", typeof appointment.doctorId);
    console.log("SERVICE, patientId type:", typeof appointment.patientId);
    if (!appointment){
      console.log("SERVICE, No appointment found");
      return null;
    }
    if(appointment.patientId !== userId && appointment.doctorId !== userId){
      console.log("SERVICE, Unauthorized cancellation attempt by user:", userId);
      throw new Error('Not authorized to cancel this appointment');
    }
    if(appointment.status === 'inactive' || appointment.status === 'cancelled'){
      console.log("SERVICE, Appointment already inactive or cancelled");
      throw new Error('Appointment is already inactive or cancelled');
    }
    appointment.status = 'inactive';
    appointment.lastUpdated = new Date();
    console.log("SERVICE, updated appointment: ", appointment)
    const savedAppointment = await appointment.save();
    return savedAppointment;
  }catch(err){
    console.error("SERVICE, error", err);
    throw err;
  }
}


async function deleteService(apptId){
  try{
    console.log("SERVICE, Searching for: ",apptId)
    apptId = apptId.trim()
    const appointment = await Appointment.deleteOne({appointmentId: apptId});
    if (!appointment){
      console.log("SERVICE, No appointment found");
      return null;
    }
    console.log("SERVICE, deleted appointment: ", appointment)
    return appointment
  }catch(err){
    console.error("SERVICE, error", err);
    throw err;
  }
}

async function modifyService(apptId, updates){
  try{
    console.log("SERVICE, Searching for: ",apptId)
    apptId = apptId.trim()
    const appointment = await Appointment.findOne({appointmentId: apptId})
    if (!appointment){
      console.log("SERVICE, No appointment found");
      return null;
    }
    //Apply updates and do checks
    console.log(updates);
    let {startTime,endTime,doctorId,patientId,status} = updates;
    if(startTime){
      if (await CheckTimeConflict(appointment.doctorId, startTime, 'doctor', appointment.appointmentId)) {
        throw new Error('Doctor has a conflicting appointment at the new time');
      }
      if (await CheckTimeConflict(appointment.patientId, startTime, 'patient', appointment.appointmentId)) {
        throw new Error('Patient has a conflicting appointment at the new time');
      }
      appointment.startTime = startTime;
      endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + 30);
      appointment.endTime = endTime;
    }
    if(doctorId){
      checkDoctorId = await User.findOne({ id: doctorId, role: 'doctor' });
      if ( !checkDoctorId ) {
        throw new Error('Invalid doctor ID');
      }
      if (await CheckTimeConflict(doctorId, appointment.startTime, 'doctor', appointment.appointmentId)) {
        throw new Error('Doctor has a conflicting appointment at the new time');
      }
      appointment.doctorId = doctorId;
    }
    if(patientId){
      checkPatientId = await User.findOne({ id: patientId, role: 'patient' });
      if ( !checkPatientId ) {
        throw new Error('Invalid patient ID');
      }
      if (await CheckTimeConflict(patientId, appointment.startTime, 'patient', appointment.appointmentId)) {
        throw new Error('Patient has a conflicting appointment at the new time');
      }
      appointment.patientId = patientId;
    }
    if(status){
      if (status === 'inactive' && appointment.status === 'inactive') {
        throw new Error('Appointment is already inactive');
      }
      if (status !== 'active' && status !== 'inactive') {
        throw new Error('Invalid status value');
      }
      appointment.status = status;
    }
    appointment.lastUpdated = new Date();
    const savedAppointment = await appointment.save();
    return savedAppointment;


  }catch(err){
    console.error("SERVICE, error", err);
    throw err;
  }
}
async function scheduleAppointment(startTime, doctorId, patientId) {

  if (!startTime ||  !doctorId || !patientId) {
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

  endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + 30); // Default appointment duration is 30 minutes
  try{
    if (new Date(startTime) >= new Date(endTime)) {
      throw new Error('Start time must be before end time');
    }

    if (await CheckTimeConflict(doctorId, startTime, 'doctor')) {
      throw new Error('Doctor has a conflicting appointment');
    }

    if (await CheckTimeConflict(patientId, startTime, 'patient')) {
      throw new Error('Patient has a conflicting appointment');
    }

    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;
    let appointmentId;
    
    while (!isUnique && attempts < maxAttempts) {

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

    const appointment = await Appointment.create(appointmentData);
    console.log('Appointment scheduled successfully:', appointment);
    return appointment;
  }
  catch (err) {
    console.error('Error scheduling appointment:', err);
    throw err;
  }

}

  async function CheckTimeConflict(userId, startTime, role, excludeAppointmentId = null) {
    const newStartTime = new Date(startTime);
    const newEndTime = new Date(newStartTime);
    newEndTime.setMinutes(newEndTime.getMinutes() + 30);

    const query = role === 'doctor' 
      ? { doctorId: userId, status: 'active' } 
      : { patientId: userId, status: 'active' };

    // Exclude the current appointment being modified
    if (excludeAppointmentId) {
      query.appointmentId = { $ne: excludeAppointmentId };
    }

    // Find all active appointments for this user
    const appointments = await Appointment.find(query);
    
    // Check if any existing appointment overlaps with the new time
    const hasConflict = appointments.some(apt => {
      const existingStart = new Date(apt.startTime);
      const existingEnd = new Date(apt.endTime);
      
      // Check for overlap: new start is before existing end AND new end is after existing start
      return newStartTime < existingEnd && newEndTime > existingStart;
    });
    
    return hasConflict;
  }


module.exports = {cancelService, deleteService, modifyService, scheduleAppointment}
