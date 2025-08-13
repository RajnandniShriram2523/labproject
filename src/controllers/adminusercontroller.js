let usermodel=require("../models/adminusermodel.js");

exports.Adduser = (req, res) => {
  let { student_name, student_email, student_password, study_year } = req.body;

  // No 'role' sent anymore
  let promise = usermodel.Adduser(student_name, student_email, student_password, study_year);

  promise
    .then((result) => {
      console.log("✅ User added:", result);
      res.json({ status: "add", msg: result });
      resolve("Student Added Successfully");
    })
    .catch((err) => {
      console.error("❌ Error adding user:", err);
      res.json({ status: "not add", msg: err });
       reject("❗ Student Not Added");
    });
};

exports.userlogin = (req, res) => {
  const {student_email,student_password} = req.body;

 let promise = usermodel.userData(student_email,student_password);
    promise.then((result) => {
        console.log("valid");
      res.json({ status: "valid", msg: result });
    })
    .catch((err) => {
         console.log("Invalid");
      res.json({ status: "invalid", msg: err });
    });
};