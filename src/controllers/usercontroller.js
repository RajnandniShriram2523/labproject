let usermodel=require("../models/usercurdmodel.js");

exports.adduser = ((req, res) => {
  let { student_name,student_email ,student_password,study_year,role} = req.body;
  let promise = usermodel.Adduser(student_name,student_email ,student_password,study_year,role);
  promise.then((result) => {
    console.log(result);
    
    res.json({status:"add", msg: result });
  }).catch((err) => {
    res.json({status:"not add",  msg: err });
  });

});








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