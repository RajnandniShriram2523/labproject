let db=require("../../db.js");

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

