let db=require("../../db.js");
// ✅ Add user to database
exports.addUser = async (student_name, student_email, student_password, study_year) => {
  try {
    const sql = `INSERT INTO student (student_name, student_email, student_password, study_year) VALUES (?, ?, ?, ?)`;
    const [result] = await db.execute(sql, [student_name, student_email, student_password, study_year]);
    return result;
  } catch (err) {
    throw err;
  }
};

// ✅ Find user by email
exports.findByEmail = async (student_email) => {
  try {
    const sql = `SELECT * FROM student WHERE student_email = ?`;
    const [rows] = await db.execute(sql, [student_email]);
    return rows[0]; // return single user or undefined
  } catch (err) {
    throw err;
  }
};

exports.getUserById = async (id) => {
  try {
    const [rows] = await db.query(
      "SELECT student_id, student_name, student_email, study_year, created_at FROM student WHERE student_id = ?",
      [id]
    );

    if (rows.length === 0) return null;
    return rows[0];
  } catch (err) {
    throw err;
  }
};


exports.viewStudentWithPagination = async (limit, offset) => {
  try {
    // Ensure limit and offset are numbers to prevent injection
    limit = parseInt(limit, 10);
    offset = parseInt(offset, 10);

    if (isNaN(limit) || isNaN(offset)) {
      throw new Error("Invalid limit or offset");
    }

    // Note: No placeholders for LIMIT and OFFSET here
    const sql = `SELECT * FROM student LIMIT ${limit} OFFSET ${offset}`;
    const [students] = await db.execute(sql);

    const [countResult] = await db.execute("SELECT COUNT(*) AS total FROM student");
    const total = countResult[0].total;

    return { students, total };
  } catch (err) {
    throw err;
  }
};













// models/userModel.js
exports.deletebystudentid = (student_id, page = 1, limit = 6) => {
  return new Promise((resolve, reject) => {
    if (!student_id || isNaN(student_id)) {
      return reject(new Error("Invalid student_id"));
    }

    const offset = (page - 1) * limit;

    // 1. Delete student
    db.query("DELETE FROM student WHERE student_id = ?", [student_id], (err, result) => {
      if (err) return reject(err);

      if (result.affectedRows === 0) {
        return reject(new Error("No student found with the given ID."));
      }

      // 2. Get updated total count
      db.query("SELECT COUNT(*) AS count FROM student", (err, countResult) => {
        if (err) return reject(err);

        const totalCount = countResult[0].count;
        const totalPages = Math.ceil(totalCount / limit);

        // 3. Fetch current page students
        db.query(
          "SELECT * FROM student ORDER BY student_id DESC LIMIT ? OFFSET ?",
          [limit, offset],
          (err, rows) => {
            if (err) return reject(err);

            resolve({ rows, totalPages, currentPage: page });
          }
        );
      });
    });
  });
};










exports.searchByEmail = async (email, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const searchTerm = `%${email}%`;

  const query = `
    SELECT * 
    FROM student 
    WHERE student_email LIKE ? 
    ORDER BY student_id DESC 
    LIMIT ? OFFSET ?`;

  const countQuery = "SELECT COUNT(*) as total FROM student WHERE student_email LIKE ?";

  const [results] = await db.query(query, [searchTerm, limit, offset]);
  const [countResult] = await db.query(countQuery, [searchTerm]);

  const total = countResult[0].total;

  return {
    studentList: results,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalRecords: total,
  };
};


// Count matching students by email only
exports.countStudentsByEmail = (search) => {
  return new Promise((resolve, reject) => {
    const searchTerm = `%${search}%`;

    const sql = `
      SELECT COUNT(*) AS total
      FROM student
      WHERE LOWER(student_email) LIKE LOWER(?)
    `;

    db.query(sql, [searchTerm], (err, result) => {
      if (err) return reject(err);
      resolve(result[0].total);
    });
  });
};




























// controllers/studentController.js

// Get student by ID


// ✅ Fetch student by ID (only DB query, no req/res)
exports.getStudentById = async (id) => {
  const [rows] = await db.execute("SELECT * FROM student WHERE student_id = ?", [id]);
  return rows.length ? rows[0] : null;
};

// ✅ Update student
exports.updateStudent = async (id, student_name, student_email, study_year) => {
  const [result] = await db.execute(
    "UPDATE student SET student_name=?, student_email=?, study_year=? WHERE student_id=?",
    [student_name, student_email, study_year, id]
  );
  return result;
};


































// exports.userData = (student_email, student_password) => {
//   return new Promise((resolve, reject) => {
//     db.query("SELECT * FROM student WHERE student_email = ? AND student_password = ? ",[student_email, student_password],(err, results) => {
//         if (err) {
//           reject("Login failed");
//         } else if (results.length > 0) {
//           resolve("Login successfully");
//         } else {
//           reject("Wrong credentials or role");
//         }
//       }
//     );
//   });
// };