const Appointment = require('../models/appointmentModel');

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
    throw err;
  }

}



module.exports = {cancelService, deleteService, modifyService}
