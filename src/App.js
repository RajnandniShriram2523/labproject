let express = require("express");
let bodyparser = require("body-parser");
let db = require("../db.js");
// let router = require("./routes/route.js");
require("dotenv").config();

let app = express();

app.use(express.static("public"));  //inbuilt middleware type
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());
// app.use("/", router);
// app.set("view engine", "ejs");

module.exports = app;