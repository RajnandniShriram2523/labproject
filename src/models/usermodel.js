const db = require("../../db.js");

exports.userprofile = (student_id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT student_name,student_email,study_year,created_at FROM student WHERE student_id = ?`;

        db.query(sql, [student_id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0]); // Return only the first matching profile
            }
        });
    });
};

exports.userviewallbook = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT b.book_id, b.book_title, b.book_author, b.book_price,b.book_published_date,b.isbn_code, c.category_name, b.status 
      FROM book b INNER JOIN category c ON b.category_id = c.category_id `
       
        db.query(sql,  (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result); // Return only the first matching profile
            }
        });
    });
};



exports.viewuserhistorybyuserid = (student_id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        s.student_id, s.student_name, s.student_email, s.study_year,
        c.category_name, b.book_title, i.issue_date, i.due_date, i.return_date, i.status
      FROM student s
      LEFT JOIN issue_book i ON i.student_id = s.student_id
      LEFT JOIN book b ON b.book_id = i.book_id
      LEFT JOIN category c ON c.category_id = b.category_id
      WHERE s.student_id = ?
     
    `;

    db.query(sql, [student_id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

exports.viewuserissuedbookbyid = (student_id) => {
  return new Promise((resolve, reject) => {
    const sql = `
     SELECT 
        s.student_id, s.student_name, s.student_email, s.study_year,
        c.category_name, b.book_title, i.issue_date, i.due_date, i.return_date, i.status
      FROM student s
      JOIN issue_book i ON i.student_id = s.student_id
      JOIN book b ON b.book_id = i.book_id
      JOIN category c ON c.category_id = b.category_id
      WHERE i.status = "issued" AND s.student_id = ?
      ORDER BY i.issue_date DESC
    `;

    db.query(sql, [student_id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

exports.viewuserreturnbookbyid= (student_id) => {
  return new Promise((resolve, reject) => {
    const sql = `
     SELECT 
        s.student_id, s.student_name, s.student_email, s.study_year,
        c.category_name, b.book_title, i.issue_date, i.due_date, i.return_date, i.status
      FROM student s
      JOIN issue_book i ON i.student_id = s.student_id
      JOIN book b ON b.book_id = i.book_id
      JOIN category c ON c.category_id = b.category_id
      WHERE i.status = "returned" AND s.student_id = ?
      ORDER BY i.issue_date DESC
    `;

    db.query(sql, [student_id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};