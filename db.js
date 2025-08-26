require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.db_host,
  user: process.env.db_username,
  password: process.env.db_password,
  database: process.env.db_dbname,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection()
  .then(() => console.log("✅ Database Connected................"))
  .catch((err) => console.error("❌ Database not connected...", err));

module.exports = pool;
