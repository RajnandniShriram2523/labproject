let usermodel=require("../models/usercurdmodel.js");

exports.userlogin = (req, res) => {
  const {student_email,student_password,role} = req.body;

 let promise = usermodel.userData(student_email,student_password,role);
    promise.then((result) => {
        console.log("valid");
      res.json({ status: "valid", msg: result });
    })
    .catch((err) => {
         console.log("Invalid");
      res.json({ status: "invalid", msg: err });
    });
};