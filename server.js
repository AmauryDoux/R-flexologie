"use strict";

let express = require("express");
let app = express();
app.use(express.static('public'))
var path = require("path");


let server = app.listen(3000, function () {
    console.log("Adresse du serveur : http://localhost:3000");
   
});

app.use('/admin', express.static('admin'));