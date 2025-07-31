let adminmodel=require("../models/admincurdmodel.js");

exports.homepage = (req, res) => {
  res.send("home page");
}



exports.adminlogin = (req, res) => {
    let {admin_name,admin_password,role } = req.body;

    let promise = adminmodel.adminData(admin_name, admin_password,role);

    promise.then((result) => {
      console.log(result);
        res.json({ status: "valid", msg: result });
    }).catch((err) => {
       console.log("Invalid");
        res.json({ status: "invalid", msg: err });
    });
};

