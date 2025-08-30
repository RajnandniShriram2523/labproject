require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test DB connection once when server starts
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database Connected................");
    connection.release();
  } catch (err) {
    console.error("❌ Database not connected...", err.message);
  }
})();

module.exports = pool;
