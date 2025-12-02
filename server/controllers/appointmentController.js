
const {cancelService, deleteService, modifyService , scheduleAppointment} = require('../services/appointmentService');


module.exports.cancelAppointment = async (req, res) =>{
    try{
        const {appointmentId}= req.params;
        const appointment = await cancelService(appointmentId);
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
        const {appointmentId} = req.params;
        const appointment = await deleteService(appointmentId);
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
        const {appointmentId} = req.params;
        const updates = req.body
        const appointment = await modifyService(appointmentId, updates);
        res.status(201).json({
            message:"modified appointment successfully",
            updates:appointment
        });
    }catch(err){
        res.status(400).json({message:err.message})
    }
}


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

        const appointment = await scheduleAppointment(startDate, endDate, doctorId, patientId);
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