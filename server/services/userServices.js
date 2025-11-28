const User = require('../models/userModel');
const Appointment = require('../models/appointmentModel');


async function userDashService(UserId){
    try{
        //call model for userById
        //Any function that calls an async function must also be async and use await to get the actual data instead of a Promise!
        const userData = await User.getUserById(UserId);
        const role = userData.role;
        let appointments = null;
        if (role === 'patient') {
            appointments = await Appointment.findByPatient(UserId);
        } else if (role === 'doctor') {
            appointments = await Appointment.findByDoctor(UserId);
        }
        //return package of information containint both user and appointments.
        const payload = {
            "user":{
                "UserId": userData.id,
                "firstName":userData.firstName,
                "lastName":userData.lastName,
                "role": role
            }, 
            "appointments":appointments
        }
        console.log("RETURNING PACKAGE FROM SERVICES: ", payload);
        return payload

    }catch(err){
        console.log(err)
    }
}

module.exports = {userDashService}