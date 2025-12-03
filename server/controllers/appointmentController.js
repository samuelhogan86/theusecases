
const {cancelService, deleteService, modifyService , scheduleAppointment} = require('../services/appointmentService');

const handleErrors = (err) => {
    console.log('Error:', err.message);
    let errors = {};
    
    if (err.message === 'All fields are required to schedule an appointment') {
        errors.general = 'All fields are required to schedule an appointment';
    }
    if (err.message === 'Invalid doctor ID') {
        errors.doctorId = 'The selected doctor does not exist';
    }
    if (err.message === 'Invalid patient ID') {
        errors.patientId = 'The selected patient does not exist';
    }
    if (err.message === 'Start time must be before end time') {
        errors.startTime = 'Start time must be before end time';
    }
    if (err.message === 'Doctor has a conflicting appointment') {
        errors.doctorId = 'This doctor already has an appointment at this time';
    }
    if (err.message === 'Patient has a conflicting appointment') {
        errors.patientId = 'This patient already has an appointment at this time';
    }
    if (err.message === 'Failed to generate a unique appointment ID') {
        errors.general = 'Unable to create appointment. Please try again';
    }
    
    return errors;
}

module.exports.cancelAppointment = async (req, res) =>{
    try{
        const {AppointmentId}= req.params;
        console.log("CONTROLLER, Recieved: ", AppointmentId)
        const appointment = await cancelService(AppointmentId);
        res.status(201).json({
            message:"Update appointment status successfully",
            updates: appointment
        });
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

module.exports.removeAppointment = async (req, res) =>{

    try{
        const {AppointmentId} = req.params;
        console.log("CONTROLLER, Recieved: ", AppointmentId)
        const appointment = await deleteService(AppointmentId);
        res.status(201).json({
            message:"removed appointment successfully",
            updates:appointment

        });
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

module.exports.modifyAppointment = async(req, res)=>{
        try{
        const {AppointmentId} = req.params;
        console.log("CONTROLLER, Recieved: ", AppointmentId)
        const updates = req.body
        const appointment = await modifyService(AppointmentId, updates);
        res.status(201).json({
            message:"modified appointment successfully",
            updates:appointment
        });
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

module.exports.scheduleAppointment = async (req, res) => {
    const { startTime, doctorId, patientId } = req.body;

    const startDate = new Date(startTime);
    
    console.log(startTime, doctorId, patientId);
    try {

        const appointment = await scheduleAppointment(startDate, doctorId, patientId);
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