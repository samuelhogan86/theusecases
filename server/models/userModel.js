const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); //used to hash passwords and check validation.

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Enter the first name']
    },
    lastName: {
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

userSchema.pre('save', async function(next) {
    if(this.isModified('passwordHash')) {
        this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
        this.lastPasswordChange = new Date();
    }
    next();
});

//static method to login user
userSchema.statics.login = async function(username, password) {
    console.log('running login');
    const user = await this.findOne({ username }); //searching db for username
    if (user) {
        const auth = await bcrypt.compare(password, user.passwordHash) 
        if (auth){
            console.log("Found User: ", user)
            return user;
        }
        throw Error('incorrect password')
    }
    throw Error('incorrect username') //User not found
};


const User = mongoose.model('user', userSchema); // set model schema for user
module.exports = User;