const express = require("express");
const app = express();
const { connectDB } = require("./config/db.js");
const { initSchema } = require("./config/initSchema.js");
require("dotenv").config();

app.use(express.static("public"));

let db;

connectDB().then(async database => {
    db = database;

    await initSchema(db);
    
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
