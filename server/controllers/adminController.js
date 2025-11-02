//requires user model. 
const User = require('../models/userModel');
const bcrypt = require('bcrypt');


//handle errors
const handleErrors = (err) => {



}


module.exports.registerUser = async (req, res) => {
    const { firstName, lastName, username, password, role } = req.body;

    try {
        const user = await User.register({ firstName, lastName, username, password, role });
        const token = createToken(user._id);

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

module.exports.updateUser = async (req, res) => {


}


module.exports.deleteUser = async (req, res) => {


}

