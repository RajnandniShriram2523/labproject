let db = require("../../db.js");


exports.Addcategory = (category_name) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO category VALUES('0', ?)", [category_name], (err, result) => {
            if (err) {
                reject("Not saved: " + err);
            } else {
                resolve("Category saved successfully.");
            }
        });
    });
};

exports.viewcategoryWithPagination = (limit, offset) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM category LIMIT ? OFFSET ?", [limit, offset], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};


exports.deletebycategoryid = (category_id) => {
    return new Promise((resolve, reject) => {
        db.query("delete from category where category_id=?", [category_id], (err, result) => {
            if (err) {
                reject(err);

            }
            else {
                resolve("Succeess");
            }
        })
    });
}


exports.finalupdatecategory = (category_id,category_name) => {
    return new Promise((resolve, reject) => {
        db.query("Update category set category_name=? where category_id=?", [category_name,category_id], (err, result) => {
            if (err) {
                reject(err);

            }
            else {
                resolve("Succeess");
            }
        });
    });
}

exports.searchcategorybyname = (category_name) => {
    return new Promise((resolve, reject) => {
        db.query("select *from category where category_name like '%" + category_name + "%'", (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    })
}
