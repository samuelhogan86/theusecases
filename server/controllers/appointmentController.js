const {cancelService, removeService } = require('../services/appointmentService');













module.exports.cancelAppointment = async (req, res) =>{
    try{
        const {appointmentId}= req.params;
        const updates = req.body;
        const appointment = await cancelService(appointmentId, updates);
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
        const appointment = await removeService(appointmentId);
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
        const appointment = await this.modifyService(appointmentId, updates);
        res.status(201).json({
            message:"modified appointment successfully",
            updates:appointment
        });
    }catch(err){
        res.status(400).json({message:err.message})
    }

}