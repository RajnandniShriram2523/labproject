const db = require("../../db.js");

// exports.userprofile = (student_id) => {
//     return new Promise((resolve, reject) => {
//         const sql = `SELECT student_name,student_email,study_year,created_at FROM student WHERE student_id = ?`;

//         db.query(sql, [student_id], (err, result) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(result[0]); // Return only the first matching profile
//             }
//         });
//     });
// };




exports.userviewallbook = async ({ search = "", page = 1, limit = 5 }) => {
  try {
    const offset = (page - 1) * limit;

    const query = `
      SELECT b.book_id, b.book_title, b.book_author, b.book_price, 
             b.book_published_date, b.isbn_code, c.category_name, b.status
      FROM book b
      INNER JOIN category c ON b.category_id = c.category_id
      WHERE b.book_title LIKE ?
      LIMIT ? OFFSET ?
    `;

    const [rows] = await db.query(query, [`%${search}%`, limit, offset]);

    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM book WHERE book_title LIKE ?`,
      [`%${search}%`]
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    return {
      BookList: rows,
      currentPage: page,
      totalPages,
    };
  } catch (error) {
    throw error;
  }
};





































exports.getByStudentId = async (studentId) => {
  const query = `
    SELECT ib.issue_id, ib.book_id, b.book_title, b.book_author,
           ib.issue_date, ib.due_date, ib.return_date, ib.status
    FROM issue_book ib
    JOIN book b ON ib.book_id = b.book_id
    WHERE ib.student_id = ?`;

  const [rows] = await db.execute(query, [studentId]);
  return rows;
};

















// Get only issued books for a student

// Fetch only issued books of a student
exports.onlyviewIssuedBooks = async (studentId) => {
  try {
    const [rows] = await db.query(
      `SELECT 
         b.book_id, b.book_title, b.book_author,
         i.issue_date, i.due_date, i.return_date, i.status
       FROM issue_book  i
       JOIN book b ON i.book_id = b.book_id
       WHERE i.student_id = ? AND i.status = 'issued'`,
      [studentId]
    );
    return rows;
  } catch (err) {
    throw err;
  }
};








// Fetch only returned books of a student
exports.onlyviewReturnedBooks = async (studentId) => {
  try {
    const [rows] = await db.query(
      `SELECT 
         b.book_id, b.book_title, b.book_author,
         i.issue_date, i.due_date, i.return_date, i.status
       FROM issue_book i
       JOIN book b ON i.book_id = b.book_id
       WHERE i.student_id = ? AND i.status = 'returned'`,
      [studentId]
    );
    return rows;
  } catch (err) {
    throw err;
  }
};
