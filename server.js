//Run this file with the command "node server.js" in your terminal
//starts application server on port 3000
const express = require("express");
const app = express();

app.use(express.static("public"));

app.listen(3000, function(){ 
    console.log("Listening on port 3000");
});