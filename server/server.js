//Run this file with the command "node server.js" in your terminal
//starts application server on port 3000
const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv")
dotenv.config();

const authRoute = require('./routes/authRoutes.js');
const adminRoute = require('./routes/adminRoutes.js');
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

connectDB().then(() => {
    app.use("/auth", authRoute);
    app.use("/admin", adminRoute);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    }).catch(err=> console.error(err)
);


