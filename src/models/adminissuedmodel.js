let db = require("../../db.js");



exports.issueBook = (data) => {
    const { book_id, student_id } = data;

    return new Promise((resolve, reject) => {
        const query = `
          INSERT INTO issue_book (book_id, student_id, issue_date,due_date,return_date,  status)
          VALUES (?,  ?, NOW(), DATE_ADD(NOW(), INTERVAL 8 DAY),null, 'returned')
        `;

        db.query(query, [book_id, student_id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

exports.viewissuedbooksByUser = (student_id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                i.issue_id,
                b.book_title,
                s.student_name,
                DATE_FORMAT(i.issue_date, '%Y-%m-%d %H:%i:%s') AS issue_date,
                DATE_FORMAT(i.due_date, '%Y-%m-%d %H:%i:%s') AS due_date,
                DATE_FORMAT(i.return_date, '%Y-%m-%d %H:%i:%s') AS return_date,
                i.status
            FROM issue_book i
            LEFT JOIN book b ON i.book_id = b.book_id
            LEFT JOIN student s ON i.student_id = s.student_id
            WHERE i.student_id = ?
        `;

        // console.log( sql);
        // console.log(student_id);

        db.query(sql, [student_id], (err, result) => {
            if (err) {
                // console.error( err);
                reject(err);
            } else {
                // console.log(result);
                resolve(result);
            }
        });
    });
};

exports.viewissuedbooksByUseremail = (student_email) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                i.issue_id,
                b.book_title,
                s.student_name,
                DATE_FORMAT(i.issue_date, '%Y-%m-%d %H:%i:%s') AS issue_date,
                DATE_FORMAT(i.due_date, '%Y-%m-%d %H:%i:%s') AS due_date,
                DATE_FORMAT(i.return_date, '%Y-%m-%d %H:%i:%s') AS return_date,
                i.status
            FROM issue_book i
            JOIN book b ON i.book_id = b.book_id
            JOIN student s ON i.student_id = s.student_id
            WHERE s.student_email = ?`;
        db.query(sql, [student_email], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

