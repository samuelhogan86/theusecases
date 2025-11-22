//requires user model. 
const User = require('../models/userModel');
const Appointment = require('../services/appointmentService');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');