//Run this file with the command "node server.js" in your terminal
//starts application server on port 3000
const cors = require("cors");
const express = require("express");
const mongoose = require('mongoose');
const requireAuth = require('./middleware/authMiddleware.js');
const authRoute = require('./routes/authRoute.js');
const { connectDB } = require("./config/db.js");
const User = require('./models/userModel.js');
const Appointment = require("./models/appointmentModel.js");
require("dotenv").config();


const app = express();
// app.use(express.static("../client/public"));
app.use(cors({
  origin: "http://localhost:5173",
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB().then(async () => {

    app.use(authRoute);

    app.get("/users", requireAuth, async (req, res) => {
        try{
            const users = await User.find();
            res.json(users);
        } catch (error){
            res.status(500).json({ error: error.message });
        }
    });

    app.get("/appointments", requireAuth, async (req, res) => {
        try{
            const appointments = await Appointment.find();
            res.json(appointments);
        } catch (error){
            res.status(500).json({ error: error.message });
        }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
        console.log(`Server is running on port ${PORT}`));
}).catch(error => {
    console.error("Failed to connect to db:", error);
});


