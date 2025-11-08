const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { 
    timestamps: false  
});

appointmentSchema.pre('save', function(next) {
    this.lastUpdated = Date();
    next();
});

appointmentSchema.pre('findOneAndUpdate', function(next) {
    this.set({ lastUpdated: Date() });
    next();
});

const Appointment = mongoose.model('appointment', appointmentSchema);
module.exports = Appointment;
