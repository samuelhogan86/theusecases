const {cancelService, removeService } = require('../services/appointmentService');













module.exports.cancelAppointment = async (req, res) =>{
    try{
        const {appointmentId}= req.params;
        const update = await cancelService(appointmentId);



    }catch(err){

    }
}

module.exports.removeAppointment = async (req, res) =>{

    try{
        const {appointmentId} = req.params;
        const update = await removeService(appointmentId);
        res.status(201).json({
            message:"Update appointment status successfully"
        }
        )

    }catch(err){
        res.status(400).json({message:err.message})

    }
}