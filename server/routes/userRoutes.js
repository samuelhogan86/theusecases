const express = require('express');
const router = express.Router();
const { tokenValidator} = require("../middleware/authMiddleware");
const {getUserDash} = require("../controllers/userController");


// Doctors only have 'view' permissions for appointments
// patients have 'view' and 'cancel'
// Admins have all permissions

router.use(tokenValidator)
//Get user dashboard information, must be associated user
router.get('/:UserId/dashboard', getUserDash);


//
module.exports = router;