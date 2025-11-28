const Appointment = require('../services/appointmentService');

const handleErrors = (err) => {
    console.log('Error:', err.message);
    let errors = {};


    return errors;
}

module.exports.scheduleAppointment = async (req, res) => {
    const { startTime, endTime, doctorId, patientId } = req.body;

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    console.log(startTime, endTime, doctorId, patientId);
    try {

        const appointment = await Appointment.scheduleAppointment(startDate, endDate, doctorId, patientId);
        const appointmentResponse = appointment.toObject();

        res.status(201).json({
            message: 'Appointment scheduled successfully',
            appointment: appointmentResponse,
        });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}