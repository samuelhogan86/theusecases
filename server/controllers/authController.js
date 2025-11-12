const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { use } = require('react');

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

const maxAge = 3 * 24 * 60 * 60;
const createToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    });
};

module.exports.loginUser = async (req, res) => {
    console.log("=== LOGIN REQUEST RECEIVED ===");
    const { username, password } = req.body;

    try {
        const user = await User.login(username, password);
        const token = createToken(user);
        
        // Send token in response body instead of cookie
        res.status(200).json({ 
            user: {
                _id: user._id,
                id: user.id,
                username: user.username,
                firstName: user.firstName, 
                lastName: user.lastName,
                role: user.role,
            },
            token: token  
        });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }

}

module.exports.changePassword = async (req, res) => {
    try {
        const userId = req.params.id;
        const { currentPassword, newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters.' });
        }

        // Find user by _id or by custom id field
        const user = await User.findOne({ $or: [{ _id: userId }, { id: userId }] });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Verify current password. Support both hashed (bcrypt) and legacy plain-text comparisons.
        let match = false;
        try {
            match = await bcrypt.compare(currentPassword, user.passwordHash);
        } catch (err) {
            match = false;
        }
        if (!match && user.passwordHash === currentPassword) {
            match = true; // legacy plain text match
        }

        if (!match) return res.status(401).json({ message: 'Current password incorrect' });

        const hashed = await bcrypt.hash(newPassword, 10);
        user.passwordHash = hashed;
        user.lastPasswordChange = new Date();
        if(!user.id){
            user.id = user._id.toString();
        }
        await user.save();

        return res.status(200).json({ message: 'Password changed' });
    } catch (err) {
        console.error('changePassword error', err);
        return res.status(500).json({ message: 'Server error' });
    }
}

module.exports.logoutUser = (req, res)=>{
    try{
        res.status(200).json({message:"Logout is done client side, removing JWT from session."})
    }catch(err){
        res.status(500).json({error:"Logout Failed for some reason."})
    }
}

