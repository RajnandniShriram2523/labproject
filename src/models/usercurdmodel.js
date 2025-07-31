let db=require("../../db.js");

exports.userData = (student_email, student_password, role) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM student WHERE student_email = ? AND student_password = ? AND role = ?",[student_email, student_password, role],(err, results) => {
        if (err) {
          reject("Login failed");
        } else if (results.length > 0 && results[0].role=== "user") {
          resolve("Login successfully");
        } else {
          reject("Wrong credentials or role");
        }
      }
    );
  });
};