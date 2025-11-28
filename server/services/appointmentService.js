const Appointment = require('../models/appointmentModel');

// Static: Get all appointments with populated names
async function getAdminDash() {
  return await Appointment.getAdminDash()
}

async function cancelService(appointmentId){
  try{
    const appointment = findOne({appointmentId: appointmentId})


  }catch(err){

  }



}
async function deleteService(appointmentId){
  try{

  }catch(err){

  }

}

module.exports = {getAdminDash}
