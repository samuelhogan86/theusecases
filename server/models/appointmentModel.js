const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  appointmentId:{ 
    type: String,
    required: [true, "ID REQUIRED"]
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
  },
  doctorId: {
    type: String, //mongoose.Schema.Types.ObjectId,
    ref: 'User', //mongoose looks up reference internally
    required: [true, 'Doctor is required']
  },
  patientId: {
    type: String, //mongoose.Schema.Types.ObjectId,
    ref: 'User',//foreign object key
    required: [true, 'Patient is required']
  },
  status:{
    type: String,
    enum: ['active', 'inactive'],
    default: 'active', 
    required: true
  },
  lastUpdated: {
      type: Date
  }
});

// Static: Get all appointments with populated names
appointmentSchema.statics.getAdminDash = async function() {
  return await this.find()
    .lean() //returns plain JS objects instead of documents
    .sort({ date: 1, startTime: 1 });
};


//The following functions can be cleaned with this schema methods
appointmentSchema.methods.getAppointments = async function(){
  return
}

appointmentSchema.statics.findByPatient = async function(UserId){
  const appointments = await this.find({patientId:UserId})
  .lean()
  .sort({ date: 1, startTime: 1 });
  //user reference, joins the object with it's values fName, lName, etc.
  console.log("MODEL, Retrieving Appointments: ", appointments)
  return appointments
}

appointmentSchema.statics.findByDoctor = async function(UserId){
  const appointments = await this.find({doctorId:UserId})
  .lean()
  .sort({ date: 1, startTime: 1 });
  //sorts by date first then starttime
  console.log("MODEL, Retrieving Appointments: ", appointments) 
  return appointments
}


const Appointment = mongoose.model('appointment', appointmentSchema);
module.exports = Appointment;