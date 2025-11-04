const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); //used to hash passwords and check validation.

const hasNumber = (str) => {
    const regex = /\d/; //matches any digit
    return regex.test(str);
}

const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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
    console.log('Attempting login for usernamer:', username);

    const user = await this.findOne({ username }); //searching db for username

    if (!user) {
        throw Error('incorrect username') //User not found
    }
    
    //const auth = await bcrypt.compare(password, user.password) //for when we hash the password
    const auth = (password === user.passwordHash);

    if (!auth){
        throw Error('incorrect password')    
    }
    
    console.log('User authenticated successfully:', user.username);
    return user;
}

//static method to register user
userSchema.statics.register = async function(firstName, lastName, username, password, role){

    if (req.user.role !== "admin") {
        throw Error("Only admins can create new users");
    }
    
    if(!firstName || !lastName || !username || !password || !role){
        throw Error('All fields must be filled')
    }

    //trim whitespace
    firstName = firstName.trim();
    lastName = lastName.trim();
    username = username.trim();
    role = role.trim().toLowerCase();

    //checking if there are numbers
    if (hasNumber(firstName) || hasNumber(lastName)){
        throw Error('name has a number')
    }

    firstName = capitalize(firstName);
    lastName = capitalize(lastName);

    if (hasNumber(role)){
        throw Error('role has a number')
    }
    
    const existingUsername = await this.findOne({ username });

    if (existingUsername){
        throw Error('existing username')
    }

    if (password.length < 7){
        throw Error('password length')
    }

    const validRoles =['doctor', 'admin', 'patient'];
    if (!validRoles.includes(role)){
        throw Error('incorrect role')
    }

    //debug code
    // console.log(`
    // firstName: ${firstName},
    // lastName: ${lastName},
    // username: ${username},
    // password: ${password},
    // role: ${role}`);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    

    let isUnique = false;
    let attempts = 0;
    const maxAttemps = 10;
    while(!isUnique && attempts < maxAttemps){

        const randomNum = Math.floor(100000 + Math.random() * 900000);
        
        const prefixMap = {
            'doctor': 'D',
            'admin': 'A',
            'patient': 'P'
        };

        const prefix = prefixMap[role] || 'U';
       
        id = `${prefix}${randomNum}`;
        console.log(id);
        
        //check if ID already exists
        const existingUserID = await this.findOne({ id });
        
        if (!existingUserID){
            isUnique = true;
        }
        
        attempts++
    }

    console.log('Creating user with ID:', id);

    const userData = {
        id,
        firstName,
        lastName,
        username,
        passwordHash,
        role
    };

    console.log('User data to be created:', JSON.stringify(userData, null, 2));
    console.log('Data types:', {
        id: typeof id,
        firstName: typeof firstName,
        lastName: typeof lastName,
        username: typeof username,
        passwordHash: typeof passwordHash,
        role: typeof role
    });

    try {
        const user = await this.create(userData);
        console.log('User created successfully:', user.username, user.id);
        return user;
    }
    catch(createError) {
        console.error('CREATE ERROR DETAILS:', createError);
        console.error('Validation errors:', createError.errors);
        throw createError;
    }
}
//static method to update user
userSchema.statics.update = async function update(id, firstName, lastName, username, password, role){
    console.log('User ID:', id);
    const updateData = { firstName, lastName, username, password, role };
    console.log('Update data:', updateData);

     if (req.user.role !== "admin") {
        throw Error("Only admins can update users");
    }

    const updates = {};

    const existingUser = this.findOne(id);
    if(!existingUser){
        throw Error('User doesn\'t exists');
    }

    if(firstName !== undefined){
        console.log('Updating first name...');
        const trimmedFirstName = firstName.trim();

        if (!trimmedFirstName){
            throw Error('First name cannot be empty');
        }

        if(hasNumber(trimmedFirstName)){
            throw Error('name has a number');
        }
        updates.firstname = capitalize(trimmedFirstName);
        console.log('First name updated to:', updates.firstName);

    }
    if(lastName !== undefined){
        console.log('Updating last name...');
        const trimmedLastName = lastName.trim();

        if (!trimmedLastName) {
            throw Error('Last name cannot be empty');
        }

        if (hasNumber(trimmedLastName)) {
            throw Error('name has a number')
        }
        
        updates.lastName = capitalize(trimmedLastName);
        console.log('Last name update to:', updates.lastName);
    }
    if(username !== undefined){
        console.log('Updating username...');
        const trimmedUsername = username.trim();

        if(!trimmedUsername) {
            throw Error('Username cannot be empty');
        }

        const checkUsername = await this.findOne({
            username: trimmedUsername,
            id: {$ne: id}
        });

        if (checkUsername) {
            throw Error('existing username')
        }

        updates.username = trimmedUsername;
        console.log('Username updated to:', updates.username);
    }
    if(password !== undefined){
        console.log('Updating password...');

        if(password.length < 7) {
            throw Error('password length')
        }

        const salt = await bcrypt.genSalt(10);
        updates.passwordHash = await bcrypt.hash(password, salt);
        updates.lastPasswordChange = new Date();

        console.log('Password hash and ready to update');
    }
    if(role !== undefined){
        console.log('Updating role...');
        const trimmedRole = role.trim().toLowerCase();

        const validRoles = ['admin', 'doctor', 'patient'];
        if(!validRoles.includes(trimmedRole)){
            throw Error('incorrect role')
        }

        updates.role = trimmedRole;
        console.log('Role updated to:', updates.role);
    }

    if (Object.keys(updates).length === 0) {
        throw Error('no valid fields')
    }

    console.log('Final updates to be applied:', updates);

    const updatedUser = await this.findByIdAndUpdate(
        id,
        updates,
        {
            new: true,
            runValidators: true
        }
    );

    console.log('User updated successfully:', updatedUser.id);
    return updatedUser;

}

userSchema.statics.deleteUserById= async function(id){
    const user = await this.findOneAndDelete({id});
    return user;

}
userSchema.statics.getAllUsers = async function(){
    
}
const User = mongoose.model('user', userSchema); // set model schema for user
module.exports = User;