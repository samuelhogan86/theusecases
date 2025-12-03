//Run this file with the command "node server.js" in your terminal
//starts application server on port 3000
const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv")
dotenv.config();

const authRoute = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const appointmentRoutes = require('./routes/appointmentRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const { connectDB } = require("./config/db.js");

const app = express();

// app.use(express.static("../client/public"));
app.use(cors({
  origin: "http://localhost:5173",
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let db;

connectDB().then(async database => {
    if (!database) throw new Error("Database connection failed."); 
    db = database;
    
    //debug code
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        console.log('Body: ', req.body);
        next();
    })

    //Entry point test
    app.get('/', (req, res) => {
      res.send('Server Running');
    });

    app.use('/api/auth', authRoute);
    app.use('/api/appointments', appointmentRoutes);
    app.use('/api/users', userRoutes);

    
    // app.get("/users", async (req, res) => {
    //     const users = await db.collection("users").find().toArray();
    //     res.json(users);
    // });

    // app.get("/appointments", async (req, res) => {
    //     const appointments = await db.collection("appointments").find().toArray();
    //     res.json(appointments);
    // });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    }).catch(err=> console.error(err)
);


