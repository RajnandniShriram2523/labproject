let express = require("express");
let bodyParser = require("body-parser");
let db = require("../db.js");
let router = require("./routes/route.js");
let cors = require("cors");
require("dotenv").config();

let app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", router);

module.exports = app;