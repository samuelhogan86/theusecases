const User = require('../models/userModel');
const Appointment = require('../models/appointmentModel');


async function userDashService(UserId){
    try{
        //call model for userById
        const userData = User.getUserById(UserId);
        const role = userData.role;
        let appointments = null;
        if (role === 'patient') {
            appointments = await Appointment.findByPatient(userId);
        } else if (role === 'doctor') {
            appointments = await Appointment.findByDoctor(userId);
        }
        //return package of information containint both user and appointments.
        const package = {
            "user":{
                "UserId": userData.userId,
                "firstName":userData.firstName,
                "lastName":userData.lastName
            }, 
            "appointments":appointments
        }
        console.log("RETURNING PACKAGE FROM SERVICES: ", package);
        return package

    }catch(err){
        console.log(err)
    }
}