let db=require("../../db.js");



exports.Adduser = (student_name,student_email ,student_password,study_year,role) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO student VALUES('0',?,?,?,?,?)",  [student_name,student_email ,student_password,study_year,role], (err, result) => {
            if (err) {
                reject("Not saved: " + err);
            } else {
                resolve("Student  Register successfully.");
            }
        });
    });
};









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