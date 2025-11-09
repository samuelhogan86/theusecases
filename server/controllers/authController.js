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

// create json web token, stores authentication,
const maxAge = 3 * 24 * 60 * 60;
const generateToken = (user) => {
    return jwt.sign({ 
        id: user._id,
        role: user.role
     }, 
     process.env.JWT_SECRET, {
        expiresIn: maxAge
    });
};

module.exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.login(username, password);
        const token = generateToken(user); //was passing user._id
        
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

module.exports.changeUserPass = async(req, res)=>{
    try{
        //get user password check, they must send current pass, and new pass
        const {currentPass, newPass} = req.body;
        //retrieve user document from database
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({error:"Invalid User!"});

        //compare currentPass and retrieved pass.


    }catch(err){
        res.status(500).json({error:"Failed to change pass"})
    }


}

