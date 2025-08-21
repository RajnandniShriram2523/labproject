let db = require("../../db.js");



exports.issueBook = (data) => {
    const { book_id, student_id } = data;

    return new Promise((resolve, reject) => {
        const query = `INSERT INTO issue_book (book_id, student_id, issue_date,due_date,return_date,  status)
          VALUES (?,  ?, NOW(), DATE_ADD(NOW(), INTERVAL 8 DAY),null, 'returned')
        `;

        db.query(query, [book_id, student_id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

// exports.viewissuedbooks = () => {
//     return new Promise((resolve, reject) => {
//         const sql = `SELECT i.issue_id,b.book_title,s.student_name,
//                 DATE_FORMAT(i.issue_date, '%Y-%m-%d %H:%i:%s') AS issue_date,
//                 DATE_FORMAT(i.due_date, '%Y-%m-%d %H:%i:%s') AS due_date,
//                 DATE_FORMAT(i.return_date, '%Y-%m-%d %H:%i:%s') AS return_date,
//                 i.status FROM issue_book i
//                 LEFT JOIN book b ON i.book_id = b.book_id
//                 LEFT JOIN student s ON i.student_id = s.student_id where i.status="returned" `;

//         db.query(sql, (err, result) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(result);
//             }
//         });
//     });
// };

exports.viewissuedbooks = (limit = 5, offset = 0) => {
    return new Promise((resolve, reject) => {
        const dataQuery = `
            SELECT i.issue_id, b.book_title, s.student_name,
                DATE_FORMAT(i.issue_date, '%Y-%m-%d %H:%i:%s') AS issue_date,
                DATE_FORMAT(i.due_date, '%Y-%m-%d %H:%i:%s') AS due_date,
                DATE_FORMAT(i.return_date, '%Y-%m-%d %H:%i:%s') AS return_date,
                i.status
            FROM issue_book i
            LEFT JOIN book b ON i.book_id = b.book_id
            LEFT JOIN student s ON i.student_id = s.student_id
            ORDER BY i.issue_date DESC
            LIMIT ? OFFSET ?`;

        const countQuery = `SELECT COUNT(*) AS total FROM issue_book`;

        db.query(dataQuery, [parseInt(limit), parseInt(offset)], (err, dataResult) => {
            if (err) return reject(err);

            db.query(countQuery, (err, countResult) => {
                if (err) return reject(err);

                const total = countResult[0].total;

                resolve({
                    BookList: dataResult,
                    total: total
                });
            });
        });
    });
};




// exports.viewissuedbooksisssued = () => {
//     return new Promise((resolve, reject) => {
//         const sql = ` SELECT i.issue_id,b.book_title,s.student_name,
//                 DATE_FORMAT(i.issue_date, '%Y-%m-%d %H:%i:%s') AS issue_date,
//                 DATE_FORMAT(i.due_date, '%Y-%m-%d %H:%i:%s') AS due_date,
//                 DATE_FORMAT(i.return_date, '%Y-%m-%d %H:%i:%s') AS return_date,i.status FROM issue_book i
//             LEFT JOIN book b ON i.book_id = b.book_id
//             LEFT JOIN student s ON i.student_id = s.student_id where i.status="issued" `;

//         db.query(sql, (err, result) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(result);
//             }
//         });
//     });
// };

exports.viewissuedbooksisssued = (limit = 5, offset = 0) => {
  return new Promise((resolve, reject) => {
    const dataQuery = `
      SELECT i.issue_id, b.book_title, s.student_name,
             DATE_FORMAT(i.issue_date, '%Y-%m-%d %H:%i:%s') AS issue_date,
             DATE_FORMAT(i.due_date, '%Y-%m-%d %H:%i:%s') AS due_date,
             DATE_FORMAT(i.return_date, '%Y-%m-%d %H:%i:%s') AS return_date,
             i.status
      FROM issue_book i
      LEFT JOIN book b ON i.book_id = b.book_id
      LEFT JOIN student s ON i.student_id = s.student_id
      WHERE i.status = "issued"
      LIMIT ? OFFSET ?`;

    const countQuery = `SELECT COUNT(*) AS total FROM issue_book WHERE status = "issued"`;

    db.query(dataQuery, [limit, offset], (err, dataResult) => {
      if (err) {
        console.error("Error in dataQuery:", err);
        return reject(err);
      }

      db.query(countQuery, (err2, countResult) => {
        if (err2) {
          console.error("Error in countQuery:", err2);
          return reject(err2);
        }

        const total = countResult[0].total;
        resolve({ BookList: dataResult, total });
      });
    });
  });
};




// exports.viewissuedbooksreturned = () => {
//     return new Promise((resolve, reject) => {
//         const sql = `SELECT i.issue_id, b.book_title,s.student_name,
//                 DATE_FORMAT(i.issue_date, '%Y-%m-%d %H:%i:%s') AS issue_date,
//                 DATE_FORMAT(i.due_date, '%Y-%m-%d %H:%i:%s') AS due_date,
//                 DATE_FORMAT(i.return_date, '%Y-%m-%d %H:%i:%s') AS return_date,
//                 i.status FROM issue_book i
//             LEFT JOIN book b ON i.book_id = b.book_id
//             LEFT JOIN student s ON i.student_id = s.student_id where i.status="returned" `;

//             db.query(sql, (err, result) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(result);
//             }
//         });
//     });
// };

exports.viewissuedbooksreturned = (page = 1, limit = 10) => {
    return new Promise((resolve, reject) => {
        const offset = (page - 1) * limit;

        const sql = `
            SELECT i.issue_id, b.book_title, s.student_name,
                DATE_FORMAT(i.issue_date, '%Y-%m-%d %H:%i:%s') AS issue_date,
                DATE_FORMAT(i.due_date, '%Y-%m-%d %H:%i:%s') AS due_date,
                DATE_FORMAT(i.return_date, '%Y-%m-%d %H:%i:%s') AS return_date,
                i.status
            FROM issue_book i
            LEFT JOIN book b ON i.book_id = b.book_id
            LEFT JOIN student s ON i.student_id = s.student_id
            WHERE i.status = "returned"
            ORDER BY i.return_date DESC
            LIMIT ? OFFSET ?
        `;

        db.query(sql, [limit, offset], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};



// exports.viewissuedbooksByUser = (student_id) => {
//     return new Promise((resolve, reject) => {
//         const sql = `SELECT i.issue_id,b.book_title,s.student_name,
//                 DATE_FORMAT(i.issue_date, '%Y-%m-%d %H:%i:%s') AS issue_date,
//                 DATE_FORMAT(i.due_date, '%Y-%m-%d %H:%i:%s') AS due_date,
//                 DATE_FORMAT(i.return_date, '%Y-%m-%d %H:%i:%s') AS return_date,
//                 i.status FROM issue_book i
//             LEFT JOIN book b ON i.book_id = b.book_id
//             LEFT JOIN student s ON i.student_id = s.student_id WHERE i.student_id = ? `;

//         db.query(sql, [student_id], (err, result) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(result);
//             }
//         });
//     });
// };

exports.viewIssuedBooksByUser = (student_id, page = 1, limit = 10) => {
    return new Promise((resolve, reject) => {
        const offset = (page - 1) * limit;

        const sql = `
            SELECT i.issue_id, b.book_title, s.student_name,
                DATE_FORMAT(i.issue_date, '%Y-%m-%d %H:%i:%s') AS issue_date,
                DATE_FORMAT(i.due_date, '%Y-%m-%d %H:%i:%s') AS due_date,
                DATE_FORMAT(i.return_date, '%Y-%m-%d %H:%i:%s') AS return_date,
                i.status
            FROM issue_book i
            LEFT JOIN book b ON i.book_id = b.book_id
            LEFT JOIN student s ON i.student_id = s.student_id
            WHERE i.student_id = ?
            LIMIT ? OFFSET ?
        `;

        db.query(sql, [student_id, limit, offset], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};



// exports.viewissuedbooksByUseremail = (student_email) => {
//     return new Promise((resolve, reject) => {
//         const sql = `SELECT i.issue_id,b.book_title,s.student_name,
//                 DATE_FORMAT(i.issue_date, '%Y-%m-%d %H:%i:%s') AS issue_date,
//                 DATE_FORMAT(i.due_date, '%Y-%m-%d %H:%i:%s') AS due_date,
//                 DATE_FORMAT(i.return_date, '%Y-%m-%d %H:%i:%s') AS return_date,
//                 i.status FROM issue_book i
//                 JOIN book b ON i.book_id = b.book_id
//                 JOIN student s ON i.student_id = s.student_id WHERE s.student_email = ?`;
//         db.query(sql, [student_email], (err, result) => {
//             if (err) reject(err);
//             else resolve(result);
//         });
//     });
// };
exports.viewissuedbooksByUseremail = (student_email, page = 1, limit = 5) => {
    return new Promise((resolve, reject) => {
        const offset = (page - 1) * limit;

        // Query to get paginated data
        const dataSql = `
            SELECT i.issue_id, b.book_title, s.student_name,
                DATE_FORMAT(i.issue_date, '%Y-%m-%d %H:%i:%s') AS issue_date,
                DATE_FORMAT(i.due_date, '%Y-%m-%d %H:%i:%s') AS due_date,
                DATE_FORMAT(i.return_date, '%Y-%m-%d %H:%i:%s') AS return_date,
                i.status
            FROM issue_book i
            JOIN book b ON i.book_id = b.book_id
            JOIN student s ON i.student_id = s.student_id
            WHERE s.student_email = ?
            LIMIT ? OFFSET ?
        `;

        // Query to get total count
        const countSql = `
            SELECT COUNT(*) AS total
            FROM issue_book i
            JOIN student s ON i.student_id = s.student_id
            WHERE s.student_email = ?
        `;

        // First, get the total count
        db.query(countSql, [student_email], (countErr, countResult) => {
            if (countErr) {
                return reject(countErr);
            }

            const totalRecords = countResult[0].total;
            const totalPages = Math.ceil(totalRecords / limit);

            // Then, fetch the paginated data
            db.query(dataSql, [student_email, limit, offset], (dataErr, dataResult) => {
                if (dataErr) {
                    reject(dataErr);
                } else {
                    resolve({
                        totalRecords,
                        totalPages,
                        currentPage: page,
                        data: dataResult
                    });
                }
            });
        });
    });
};