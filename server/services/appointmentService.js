const Appointment = require('../models/appointmentModel');
const User = require('../models/userModel');

// Static: Get all appointments with populated names
async function cancelService(apptId){
  try{
    console.log("SERVICE, Searching for: ",apptId)
    apptId = apptId.trim()
    const appointment = await Appointment.findOne({appointmentId: apptId});
    console.log(appointment)
    console.log("SERVICE, doctorId type:", typeof appointment.doctorId);
    console.log("SERVICE, patientId type:", typeof appointment.patientId);
    if (!appointment){
      console.log("SERVICE, No appointment found");
      return null;
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
      if (CheckTimeConflict(appointment.doctorId, startTime, 'doctor')) {
        throw new Error('Doctor has a conflicting appointment at the new time');
      }
      if (CheckTimeConflict(appointment.patientId, startTime, 'patient')) {
        throw new Error('Patient has a conflicting appointment at the new time');
      }
      appointment.startTime = startTime;
      endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + 30);
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

    if (CheckTimeConflict(doctorId, startTime, 'doctor')) {
      throw new Error('Doctor has a conflicting appointment');
    }

    if (CheckTimeConflict(patientId, startTime, 'patient')) {
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

  async function CheckTimeConflict(userId, startTime, role) {
    const query = role === 'doctor' ? { doctorId: userId } : { patientId: userId };
    query.startTime = startTime;
    const conflictingAppointment = await Appointment.findOne({ query });
    if (conflictingAppointment) {
      return true;
    }
    return false;
  }


module.exports = {cancelService, deleteService, modifyService, scheduleAppointment}
