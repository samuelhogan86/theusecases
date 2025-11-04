//Run this file with the command "node server.js" in your terminal
//starts application server on port 3000
const express = require("express");
const mongoose = require('mongoose');
const authRoute = require('./routes/authRoutes.js');
const adminRoute = require('./routes/adminRoutes.js');
const { connectDB } = require("../config/db.js");
require("dotenv").config();


const app = express();
app.use(express.static("../client/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let db;

connectDB().then(async database => {
    db = database;

    //debug code
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        console.log('Body: ', req.body);
        next();
    })


    app.use(authRoute);
    app.use('/api/admin', adminRoute);
    
    app.get("/users", async (req, res) => {
        const users = await db.collection("users").find().toArray();
        res.json(users);
    });

    app.get("/appointments", async (req, res) => {
        const appointments = await db.collection("appointments").find().toArray();
        res.json(appointments);
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => 
        console.log(`Server is running on port ${PORT}`));
    }).catch(err=>console.error(err));


