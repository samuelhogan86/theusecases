const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

//handle errors
const handleErrors = (err) => {
    console.log('Error:', err.message);
    let errors = { username: '', password: '' };
    
    // incorrect username
    if (err.message === 'incorrect username') { //user wasnt found by query
        errors.username = 'That username is not registered';
    }
    
    // incorrect password
    if (err.message === 'incorrect password') { //wrong pass
        errors.password = 'That password is incorrect';
    }
    
    return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'use cases secret', {
        expiresIn: maxAge
    });
};

module.exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    console.log("Username is ", username);
    console.log("Password is ", password);

    try {
        console.log("Trying to await User.login");
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }

}

module.exports.registerUser = (req, res) => {

}