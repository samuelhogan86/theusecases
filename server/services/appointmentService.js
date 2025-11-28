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
    await appointment.save();
  }catch(err){
    console.log(err)
  }
}


async function deleteService(apptId){
  try{
    const appointment = await Appointment.deleteOne({appointmentId:apptId});
    return appointment;
  }catch(err){
    console.log(err)
  }

}

async function modifyService(){
  return;
}

module.exports = {cancelService, deleteService}
