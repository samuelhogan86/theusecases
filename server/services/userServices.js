const User = require('../models/userModel');
const Appointment = require('../models/appointmentModel');


async function userDashService(UserId){
    try{
        //package schema
        let data = {
            "user": {
                "id":UserId, 
                "firstName": "your", 
                "lastName": "mom"
        },
            "appointments":[{
                "appointmentId":123, 
                "startTime":"today",
                "endTime":"yesterday",
                "doctor":"your moms doctor",
                "patient":"Urself",
                "lastUpdated":"in-progress"
                }]
        };


        //call model for userById
        const userData = User.getUserById(UserId);


        //call model for AppointmentById
        const appointments = Appointment.getUserAppointment(UserId);

        //return package of information containint both user and appointments.

    }catch(err){
        console.log(err)
    }
}