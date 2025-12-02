const User = require('../models/userModel');
const Appointment = require('../models/appointmentModel');



async function userDashService(UserId){
    try{
        //call model for userById
        //Any function that calls an async function must also be async and use await to get the actual data instead of a Promise!
        const userData = await User.getUserById(UserId);
        const role = userData.role;
        let appointments = null;
        let users = null;

        //are we getting appointmetns for patients or doctors?
        if (role === 'patient') {
            appointments = await Appointment.findByPatient(UserId);
        } else if (role === 'doctor') {
            appointments = await Appointment.findByDoctor(UserId);
        }else if (role === 'admin'){
            appointments = await Appointment.getAppointments();
            users = await User.getUsers();
        }

        //efficient searching, set to array, remove dupes
        const doctorIds = [...new Set(appointments.map(apt => apt.doctorId))];
        const patientIds = [...new Set(appointments.map(apt => apt.patientId))];
        //parallel query, get patient and doctor users.
        const [doctors, patients] = await Promise.all([
            Promise.all(doctorIds.map(id => User.getUserById(id))),
            Promise.all(patientIds.map(id => User.getUserById(id)))
        ]);
        console.log("SERVICE, mapped all users");
        console.log(`Found appointment users: ${doctors.length}, ${patients.length}`)

        const doctorMap = Object.fromEntries(doctors.filter(doc => doc !== null).map(doc => [doc.id, doc]));
        const patientMap = Object.fromEntries(patients.filter(pat => pat !== null).map(pat => [pat.id, pat]));
        

        const joinedAppointments = appointments.map(apt => ({  // Transform each appointment
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
                "username":userData.username,
                "role": role
            }, 
            "appointments":joinedAppointments,
            "users": users
        }
        console.log("SERVICES, returning payload: ", payload);


        return payload

    }catch(err){
        console.log(err)
    }
}

module.exports = {userDashService}