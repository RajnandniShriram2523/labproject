let db=require("../../db.js");



exports.Adduser = (student_name, student_email, student_password, study_year) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO student (student_name, student_email, student_password, study_year) VALUES (?, ?, ?, ?)`;

    db.query(sql, [student_name, student_email, student_password, study_year], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve("Student added successfully");
      }
    });
  });
};

exports.userData = (student_email, student_password) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM student WHERE student_email = ? AND student_password = ? ",[student_email, student_password],(err, results) => {
        if (err) {
          reject("Login failed");
        } else if (results.length > 0) {
          resolve("Login successfully");
        } else {
          reject("Wrong credentials or role");
        }
      }
    );
  });
};