const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); //used to hash passwords and check validation.

const userSchema = new mongoose.Schema({
    id: {
        type: String, 
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: [true, 'Enter the first name']
    },
    LastName: {
        type: String,
        required: [true, 'Enter the last name']
    },
    username: {
        type: String,
        required: [true, 'Enter a username'],
        unique: true
    },
    passwordHash: {
        type: String, 
        required: [true, 'Enter a password'],
        minLength: [6, 'Minimum password length is 6 characters']
    },
    role:{
        type: String, 
        required: [true, 'Enter one of the three roles: admin, doctor, patient'],
        lowercase: true,
        enum: ['admin', 'doctor', 'patient']
    },
    lastLogin: {
        type: Date
    },
    lastPasswordChange: {
        type: Date
    },
});

//static methond to login user
userSchema.statics.login = async function(username, password){
    console.log('running login');
    const user = await this.findOne({ username }); //searching db for username
    if (user) {
        //const auth = await bcrypt.compare(password, user.password) //for when we hash the password
        const auth = (password === user.passwordHash);
        if (auth){
            console.log("Found User: ", user)
            return user;
        }
        throw Error('incorrect password')
    }
    throw Error('incorrect username') //User not found
}


const User = mongoose.model('user', userSchema); // set model schema for user
module.exports = User;