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
    console.log("=== LOGIN REQUEST RECEIVED ===");
    console.log("Request body:", req.body);
    console.log("Username:", req.body.username);
    console.log("Password:", req.body.password);
    const { username, password } = req.body;

    try {
        const user = await User.login(username, password);
        const token = createToken(user._id);
        
        user.lastLogin = new Date();
        await user.save();

        // Send token in response body instead of cookie
        res.status(200).json({ 
            user: {
                _id: user._id,
                username: user.username,
                firstName: user.firstName, 
                lastName: user.lastName,
                role: user.role,
                lastLogin: user.lastLogin, 
                lastPasswordChange: user.lastPasswordChange
            },
            token: token  
        });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }

}

module.exports.registerUser = async (req, res) => {
    console.log("=== REGISTER REQUEST RECEIVED ===");
    const{ username, firstName, lastName, password, role } = req.body;

    try{
        const user = await User.create({
            firstName,
            lastName,
            username,
            passwordHash: password,
            role,
            lastPasswordChange: new Date()
        });

        const token = createToken(user._id);
        res.status(201).json({
            user: {
                _id: user._id,
                username: user.username,
                firstName: user.firstName, 
                lastName: user.lastName,
                role: user.role,
                lastPasswordChange: user.lastPasswordChange,
                lastLogin: user.lastLogin || null
            },
            token: token  
        });
    } catch (err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}