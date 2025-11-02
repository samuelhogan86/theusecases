const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); //used to hash passwords and check validation.

const hasNumber = (str) => {
    const regex = /\d/; //matches any digit
    return regex.test(str);
}

const userSchema = new mongoose.Schema({
    id: {
        type: String, 
        unique: true
    },
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

//static method to register user
userSchema.statics.register = async function(firstName, lastName, username, password, role){
    
    //need to add checks for firstName, lastName, username, password, and role
    //checking if there are numbers
    if (hasNumber(firstName) || hasNumber(lastName)){
        throw Error('name has a number')
    }
    if (hasNumber(role)){
        throw Error('role has a number')
    }
    //cleaning the names and role
    firstName = firstName.trim();
    lastName = lastName.trim();
    role = role.trim();
    firstName = firstName.toLowerCase();
    lastName = lastName.toLowerCase();
    role = role.toLowerCase();


    const existingUsername = await mongoose.model('user').findOne({ username: username });
    if (existingUsername){
        throw Error('existing username')
    }

    if (password.length < 7){
        throw Error('password length')
    }

    if (!(role === 'doctor') && !(role) === 'admin' && !(role) === 'patient'){
        throw Error('incorrect role')
    }

    //debug code
    console.log(`
    firstName: ${firstName},
    lastName: ${lastName},
    username: ${username},
    password: ${password},
    role: ${role}`);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    console.log(`passwordhash: ${passwordHash}`);

    let flag = true;
    while(flag){

        const randomNum = Math.floor(100000 + Math.random() * 900000);

        let prefix = 'U';
        switch(role){
            case('doctor'):
                prefix = 'D';
                break;
            case('admin'):
                prefix = 'A';
                break;
            case('patient'):
                prefix = 'P';
                break;
        }
        
        id = `${prefix}${randomNum}`;
        console.log(id);
        
        //check if ID already exists
        const existingUserID = await mongoose.model('user').findOne({ id: id });
        
        if (!existingUserID){
            flag = false;
        }
    }

    const user = await this.create({
        id,
        firstName,
        lastName,
        username,
        passwordHash,
        role
    });
    
    return user;
}


const User = mongoose.model('user', userSchema); // set model schema for user
module.exports = User;