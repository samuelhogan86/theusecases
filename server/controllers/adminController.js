//requires user model. 
const User = require('../models/userModel');
const bcrypt = require('bcrypt');


//handle errors
const handleErrors = (err) => {
    console.log('Error:', err.message);
    let errors = {name: '', username: '', password: '', role: ''};

    if (err.message === 'name has a number'){
        errors.name = 'Names can\'t have any digits in them';
    }
    if (err.message === 'role has a number'){
        error.role = 'Role must be: doctor, admin, or patient'
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
        error.name = 'All fields are required'
    }

    return errors;
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    });
};

module.exports.registerUser = async (req, res) => {
    const { firstName, lastName, username, password, role } = req.body;
    try {
        const user = await User.register(firstName, lastName, username, password, role);
        const token = createToken(user._id);

        const userResponse = user.toObject();
        delete userResponse.passwordHash;

        res.status(201).json({
            message: 'User registered successfully',
            user: userResponse,
            token: token
        });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }

}

module.exports.updateUser = async (req, res) => {
    const {id, firstName, lastName, username, password, role } = req.body;
    try {
        const user = await User.update(id, firstName, lastName, username, password, role);

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


}

