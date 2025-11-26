//requires user model. 
const {userDashService} = require('../services/userServices');
const Appointment = require('../services/appointmentService');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports.getUserDash =  async(req, res) =>{
    try{
        const {UserId} = req.params;
        const userData = userDashService(UserId);
        res.status(200).json({
            message: "Retrieved Data Successfully", 
            user: userData
        })


    }catch(err){
        res.status(400).json({message:err.message})
    }

}