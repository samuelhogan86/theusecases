const User = require('../models/userModel');
const Appointment = require('../models/appointmentModel');


async function userDashService(UserId){
    try{
        //call model for userById
        //Any function that calls an async function must also be async and use await to get the actual data instead of a Promise!
        const userData = await User.getUserById(UserId);
        const role = userData.role;
        let appointments = null;

        //are we getting appointmetns for patients or doctors?
        if (role === 'patient') {
            appointments = await Appointment.findByPatient(UserId);
        } else if (role === 'doctor') {
            appointments = await Appointment.findByDoctor(UserId);
        }


        const doctorId = appointments.doctorId;
        const patientId = appointments.patientId;
        //parallel query, get patient and doctor users.
        const [doctors, patients] = await Promise.all([
            User.getUserById(doctorId), 
            User.getUserById(patientId)
        ])

        console.log(`Found appointment users: ${doctors}, ${patients}`)
        appointments.map(apt => ({  // Transform each appointment
            ...apt,                   // Copy all existing fields
            doctorId: doctorMap[apt.doctorId] || apt.doctorId,  // Replace doctorId
            patientId: patientMap[apt.patientId] || apt.patientId  // Replace patientId
        }));
        
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
        console.log("SERVICES, returning payload: ", payload);
        return payload

    }catch(err){
        console.log(err)
    }
}

module.exports = {userDashService}