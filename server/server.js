//Run this file with the command "node server.js" in your terminal
//starts application server on port 3000
const express = require("express");
const mongoose = require('mongoose');
const authRoute = require('./routes/authRoute.js');
const { connectDB } = require("../config/db.js");
const { initSchema } = require("../config/initSchema.js");
require("dotenv").config();


const app = express();
app.use(express.static("../client/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let db;

connectDB().then(async database => {
    db = database;

    await initSchema(db);

    app.use(authRoute);
    
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
    });


