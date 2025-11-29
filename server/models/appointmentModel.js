const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Doctor is required']
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Patient is required']
  }
});

// Static: Get all appointments with populated names
appointmentSchema.statics.getAdminDash = async function() {
  return await this.find()
    // .populate('doctorId', 'firstName lastName _id id')
    // .populate('patientId', 'firstName lastName _id id')
    .lean()
    .sort({ date: 1, startTime: 1 });
};

const Appointment = mongoose.model('appointment', appointmentSchema);
module.exports = Appointment;