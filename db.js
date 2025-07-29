require("dotenv").config();
let mysql = require("mysql2");
let conn = mysql.createConnection({
    host: process.env.db_host,
    user: process.env.db_username,
    password: process.env.db_password,
    database: process.env.db_dbname

});
conn.connect((err) => {
    if (err) {
        console.log("Databse is not connected" + err);
    }
    else {
        console.log("Database is  connected")
    }
});

module.exports = conn;