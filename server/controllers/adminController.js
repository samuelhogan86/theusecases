//requires user model. 
const User = require('../models/userModel');
const {userDashService} = require('../services/userService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//handle errors
const handleErrors = (err) => {
    console.log('Error:', err.message);
    let errors = {};

    if (err.message === 'name has a number'){
        errors.name = 'Names can\'t have any digits in them';
    }
    if (err.message === 'role has a number'){
        errors.role = 'Role must be: doctor, admin, or patient'
    }
    if (err.message === 'existing username'){
        errors.username = 'Username is already taken'
    }
    if (err.message === 'password length'){
        errors.password = 'Password is too short (min 7)'
    }
    if (err.message === 'incorrect role'){
        errors.role = 'Role must be: doctor, admin, or patient'
    }
    if (err.message === 'All fields must be filled'){
        errors.general = 'All fields are required'
    }

    return errors;
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    });
};

module.exports.registerUser = async (req, res) => {
    const { firstName, lastName, username, password, role } = req.body;
    console.log(firstName, lastName, username, password, role);
    try {
        const user = await User.register(firstName, lastName, username, password, role);
        const token = createToken(user);
        const userResponse = user.toObject();
        delete userResponse.passwordHash;

        res.status(201).json({
            message: 'User registered successfully',
            user: userResponse,
        });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }

}

module.exports.updateUser = async (req, res) => {
    const { UserId } = req.params;
    const { firstName, lastName, username, password, role } = req.body;
    try {
        const user = await User.updateUserById(UserId, firstName, lastName, username, password, role);

        const userResponse = user.toObject();
        delete userResponse.passwordHash;

        res.status(201).json({
            message: 'User updated successfully',
            user: userResponse
        });
    }
    catch (err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}


module.exports.deleteUser = async (req, res) => {
    try{
        const { UserId } = req.params;
        const user = await User.deleteUserById(UserId);
        if(!user){
            return res.status(404).json({message:"User Not Found"});
        }
        res.status(200).json({
            message: "User Successfully Deleted",
            user: user
        })
    }catch(err){
        res.status(500).json({message:err.message});

    }
}

// module.exports.getDash = async(req, res) =>{
//     try{
//         const [users, appointments] = await Promise.all([
//             User.getAdminDash(),
//             Appointment.getAdminDash()
//         ]);
//         res.status(200).json({
//             message: "dashboard data sent",
//             users: users,
//             appointments: appointments
//         });
//     }catch(err){
//         res.status(500).json({message:err.message});
//     }   
// }


module.exports.getAdminDash = async(req, res) =>{
    try{
        const UserId = req.user.id;
        const userData = await userDashService(UserId);
        res.status(200).json({
            message: "dashboard data sent",
            payload: userData
        });
    }catch(err){
        res.status(500).json({message:err.message});
    }   
}
