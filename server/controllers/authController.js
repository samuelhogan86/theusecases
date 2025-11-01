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

// create json web token, stores authentication, WORK IN PROG
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    });
};

module.exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.login(username, password);
        const token = createToken(user._id);
        
        // Send token in response body instead of cookie
        res.status(200).json({ 
            user: user,
            token: token  
        });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }

}

