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
        return reject(err);
      }
      db.query("SELECT COUNT(*) AS total FROM category", (countErr, countResult) => {
        if (countErr) {
          return reject(countErr);
        }
        resolve({
          categories: result,
          total: countResult[0].total
        });
      });
    });
  });
};



exports.deletebycategoryid = (category_id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM category WHERE category_id = ?;", [category_id], (err, result) => {
      if (err) {
        return reject(err); // SQL error
      }
      if (result.affectedRows === 0) {
        return reject("Category not found"); // Custom error
      }
      resolve("Success");
    });
  });
};



exports.finalupdatecategory = (category_id, category_name) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE category SET category_name = ? WHERE category_id = ?";
    db.query(sql, [category_name, category_id], (err, result) => {
      if (err) {
        return reject(err); 
      }
      if (result.affectedRows === 0) {
        return reject("Category not found or no change made"); 
      }
      resolve("Success"); 
    });
  });
};


// models/admincategorymodel.js
exports.searchCategoryByName = (category_name, limit, offset) => {
  return new Promise((resolve, reject) => {
    const searchQuery = `%${category_name}%`;

    const dataQuery = `SELECT * FROM category WHERE category_name LIKE ? LIMIT ? OFFSET ?`;
    const countQuery = `SELECT COUNT(*) AS total FROM category WHERE category_name LIKE ?`;

    db.query(dataQuery, [searchQuery, limit, offset], (err, results) => {
      if (err) return reject(err);

      db.query(countQuery, [searchQuery], (err2, countResult) => {
        if (err2) return reject(err2);

        resolve({
          total: countResult[0].total,
          categories: results
        });
      });
    });
  });
};


