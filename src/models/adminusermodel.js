let db=require("../../db.js");



exports.Adduser = (student_name, student_email, student_password, study_year) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO student (student_name, student_email, student_password, study_year) VALUES (?, ?, ?, ?)`;

    db.query(sql, [student_name, student_email, student_password, study_year], (err, result) => {
      if (err) {
        reject("❗ Student Not Added");
      } else {
        resolve("Student Added Successfully");
      }
    });
  });
};





exports.viewallstudents = (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 5);
  const offset = (page - 1) * limit;

  exports.viewstudentWithPagination(limit, offset)
    .then(({ student, total }) => {
      if (!student || student.length === 0) {
        return res.status(404).json({
          status: "empty",
          message: "No students found.",
          currentPage: page,
          totalPages: 0,
          studentList: []
        });
      }

      res.json({
        status: "success",
        currentPage: page,
        perPage: limit,
        totalPages: Math.ceil(total / limit),
        studentList: student
      });
    })
    .catch((err) => {
      res.status(500).json({ status: "error", message: err.toString() });
    });
};

exports.viewstudentWithPagination = (limit, offset) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM student LIMIT ? OFFSET ?", [limit, offset], (err, result) => {
      if (err) {
        return reject(err);
      }
      db.query("SELECT COUNT(*) AS total FROM student", (countErr, countResult) => {
        if (countErr) {
          return reject(countErr);
        }
        resolve({
          student: result,
          total: countResult[0].total
        });
      });
    });
  });
};


exports.deletebystudentid = (student_id) => {
  return new Promise((resolve, reject) => {
    if (!student_id || isNaN(student_id)) {
      return reject(new Error("Invalid student_id"));
    }

    const limit = 6;
    const page = 1; // always page 1
    const offset = (page - 1) * limit;

    db.query("DELETE FROM student WHERE student_id = ?", [student_id], (err, result) => {
      if (err) {
        return reject(err);
      }
      if (result.affectedRows === 0) {
        return reject(new Error("No student found with the given ID."));
      }

      // After delete, fetch total count for pagination
      db.query("SELECT COUNT(*) AS count FROM student", (err, countResult) => {
        if (err) {
          return reject(err);
        }

        const totalCount = countResult[0].count;
        const totalPages = Math.ceil(totalCount / limit);

        // Fetch current page data (page 1 always)
        db.query("SELECT * FROM student LIMIT ? OFFSET ?", [limit, offset], (err, rows) => {
          if (err) {
            return reject(err);
          }

          resolve({ rows, totalPages, currentPage: page });  // return rows, totalPages, and currentPage
        });
      });
    });
  });
};









// 🔹 Search by name OR email
exports.searchstudent = (search, limit, offset) => {
  return new Promise((resolve, reject) => {
    const searchTerm = `%${search}%`;
    db.query(
      "SELECT * FROM student WHERE student_name LIKE ? OR student_email LIKE ? LIMIT ? OFFSET ?",
      [searchTerm, searchTerm, limit, offset],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

// 🔹 Count students by name OR email
exports.countStudents = (search) => {
  return new Promise((resolve, reject) => {
    const searchTerm = `%${search}%`;
    db.query(
      "SELECT COUNT(*) AS total FROM student WHERE student_name LIKE ? OR student_email LIKE ?",
      [searchTerm, searchTerm],
      (err, result) => {
        if (err) reject(err);
        else resolve(result[0].total);
      }
    );
  });
};






// Search students by name
// 📌 Controller















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