
const bcrypt = require('bcrypt'); //used to hash passwords and check validation.
const User = require('../models/userModel');


async function login(username, password) {
    console.log('Attempting login for username:', username);
    const user = await User.findOne({ username }); //searching db for username
    if (!user) {
        throw Error('incorrect username') //User not found
    }
    console.log('User found:', user.username);
    console.log('Comparing password for user:', password, user.passwordHash);
    const auth = await bcrypt.compare(password, user.passwordHash) //for when we hash the password
    if (!auth){
        throw Error('incorrect password')    
    }
    timeUpdate = {};
    timeUpdate.lastLogin = new Date();
    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        timeUpdate,
        {
            new: true,
            runValidators: true
        }
    );
    console.log('User authenticated successfully:', user.username);
    return user;
}

module.exports = {login}