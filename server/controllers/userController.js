//requires user model. 
const {userDashService} = require('../services/userServices');
const Appointment = require('../services/appointmentService');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports.getUserDash =  async(req, res) =>{
    try{
        //get session user id
        const UserId = req.user.id;
        console.log("CONTROLLER, request from: ", UserId)
        const userData = await userDashService(UserId);

        res.status(200).json({
            message: "Retrieved Data Successfully", 
            payload: userData
        });
    }catch(err){
        res.status(400).json({message:err.message})
    }

}