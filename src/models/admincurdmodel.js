let db=require("../../db.js");

const bcrypt = require("bcryptjs");

exports.addAdmin = (admin_name, admin_password, role) => {
    return new Promise((resolve, reject) => {
        db.query(
            "INSERT INTO admin (admin_name, admin_password, role) VALUES (?, ?, ?)",
            [admin_name, admin_password, role],
            (err, result) => {
                if (err) {
                    console.error("DB error:", err);
                    return reject("Data Not Saved");
                }
                return resolve("Admin Saved Successfully");
            }
        );
    });
};


exports.adminLogin = async (admin_name) => {
  try {
    console.log("in repo " + admin_name);

    const [rows] = await db.query("SELECT * FROM admin WHERE admin_name = ?", [admin_name]);
    console.log("result is ", rows);

    if (rows.length === 0) {
      return null; // return null if admin not found
    }

    return rows[0]; // return single admin object
  } catch (err) {
    throw err; // only throw if DB error
  }
};

exports.findAdminByName = async (admin_name) => {
  const sql = "SELECT * FROM admin WHERE admin_name = ?";
  return new Promise((resolve, reject) => {
    db.query(sql, [admin_name], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};





exports.adminData = (admin_name,admin_password,role) => {
   

    return new Promise((resolve, reject) => {
        db.query("select *from admin where admin_name=? and admin_password=? and role=?", [admin_name,admin_password,role], (err, results) => {
                
            if (err) {
                reject("Login failed");
            } else if (results.length>0 &&results[0].role==="admin") {

                resolve("Login successfully");
            } else{
                reject("wrong choice");
            }
        });
    });
};

