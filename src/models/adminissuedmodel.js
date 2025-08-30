let db = require("../../db.js");




// models/issuemodel.js
exports.issueBook = async (data) => {
  try {
    const { book_id, student_id } = data;

    if (!book_id || !student_id) {
      throw new Error("book_id and student_id are required");
    }

    // Check if already issued and not returned
    const [existing] = await db.query(
      `SELECT * FROM issue_book 
       WHERE book_id = ? AND student_id = ? AND status = 'issued'`,
      [book_id, student_id]
    );

    if (existing.length > 0) {
      throw new Error("This book is already issued to this student and not yet returned.");
    }

    // Insert new issue record
    const [result] = await db.query(
      `INSERT INTO issue_book (book_id, student_id, issue_date, due_date, return_date, status)
       VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 8 DAY), NULL, 'issued')`,
      [book_id, student_id]
    );

    return result;
  } catch (err) {
    console.error("Error issuing book:", err);
    throw err;
  }
};






exports.viewissuedbooks = async (limit, offset) => {
  try {
    // Ensure limit and offset are numbers to prevent injection
    limit = parseInt(limit, 10);
    offset = parseInt(offset, 10);

    if (isNaN(limit) || isNaN(offset)) {
      throw new Error("Invalid limit or offset");
    }

    const sql = `
      SELECT i.issue_id, b.book_title, s.student_name,
        DATE_FORMAT(i.issue_date, '%Y-%m-%d %H:%i:%s') AS issue_date,
        DATE_FORMAT(i.due_date, '%Y-%m-%d %H:%i:%s') AS due_date,
        DATE_FORMAT(i.return_date, '%Y-%m-%d %H:%i:%s') AS return_date,
        i.status
      FROM issue_book i
      LEFT JOIN book b ON i.book_id = b.book_id
      LEFT JOIN student s ON i.student_id = s.student_id
      ORDER BY i.issue_date DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const [BookList] = await db.execute(sql);

    const [countResult] = await db.execute("SELECT COUNT(*) AS total FROM issue_book");
    const total = countResult[0].total;

    return { BookList, total };
  } catch (err) {
    throw err;
  }
};









exports.toggleIssueBookStatus = async (issue_id) => {
  try {
    // Get current status
    const [result] = await db.execute("SELECT status FROM issue_book WHERE issue_id = ?", [issue_id]);

    if (result.length === 0) {
      throw new Error("Issue not found");
    }

    const currentStatus = result[0].status;

    if (currentStatus === "issued") {
      // Update status to returned and set return_date
      await db.execute(
        `UPDATE issue_book
         SET status = "returned", return_date = CURRENT_TIMESTAMP
         WHERE issue_id = ?`,
        [issue_id]
      );
      return "returned";
    } else {
      // If already returned, just return current status
      return currentStatus;
    }
  } catch (err) {
    throw err;
  }
};












exports.viewissuedbooksisssued = async (limit, offset) => {
  try {
    // Ensure limit and offset are valid numbers
    limit = parseInt(limit, 10);
    offset = parseInt(offset, 10);

    if (isNaN(limit) || isNaN(offset)) {
      throw new Error("Invalid limit or offset");
    }

    // Query to fetch paginated books with status "issued"
    const sql = `
      SELECT i.issue_id, b.book_title, s.student_name,
        DATE_FORMAT(i.issue_date, '%Y-%m-%d %H:%i:%s') AS issue_date,
        DATE_FORMAT(i.due_date, '%Y-%m-%d %H:%i:%s') AS due_date,
        DATE_FORMAT(i.return_date, '%Y-%m-%d %H:%i:%s') AS return_date,
        i.status
      FROM issue_book i
      LEFT JOIN book b ON i.book_id = b.book_id
      LEFT JOIN student s ON i.student_id = s.student_id
      WHERE i.status = "issued"
      ORDER BY i.issue_date DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const [books] = await db.execute(sql);

    // Count total issued books
    const [countResult] = await db.execute(`
      SELECT COUNT(*) AS total FROM issue_book WHERE status = "issued"
    `);

    const totalItems = countResult[0]?.total ?? 0;
    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = totalItems > 0 ? Math.ceil(totalItems / limit) : 1;

    return {
      status: "success",
      currentPage,
      perPage: limit,
      totalItems,
      totalPages,
      data: books
    };

  } catch (err) {
    console.error("Error in viewissuedbooksisssued:", err);
    throw err;
  }
};




exports.viewissuedbooksreturned = async (limit, offset) => {
  try {
    limit = parseInt(limit, 10);
    offset = parseInt(offset, 10);

    if (isNaN(limit) || isNaN(offset)) {
      throw new Error("Invalid limit or offset");
    }

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
      LIMIT ${limit} OFFSET ${offset}
    `;

    const [books] = await db.execute(sql);

    const [countResult] = await db.execute(`
      SELECT COUNT(*) AS total FROM issue_book WHERE status = "returned"
    `);

    const totalItems = countResult[0]?.total ?? 0;
    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = totalItems > 0 ? Math.ceil(totalItems / limit) : 1;

    return {
      status: "success",
      currentPage,
      perPage: limit,
      totalItems,
      totalPages,
      data: books
    };

  } catch (err) {
    console.error("Error in viewissuedbooksreturned:", err);
    throw err;
  }
};




exports.viewissuedbooksByUseremail = async (student_email) => {
  try {
    if (!student_email) {
      throw new Error("student_email is required");
    }

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
      ORDER BY i.issue_date DESC
    `;

    const countSql = `
      SELECT COUNT(*) AS total
      FROM issue_book i
      JOIN student s ON i.student_id = s.student_id
      WHERE s.student_email = ?
    `;

    const [countResult] = await db.execute(countSql, [student_email]);
    const totalItems = countResult[0]?.total ?? 0;

    const [books] = await db.execute(dataSql, [student_email]);

    return {
      status: "success",
      totalItems,
      data: books,
    };
  } catch (err) {
    console.error("Error in viewissuedbooksByUseremail:", err);
    throw err;
  }
};



/*search issue book by student_name*/



// Search issued books by student_name (no pagination)
exports.searchIssuedBooksByStudentName = async (studentName) => {
  try {
    if (!studentName || typeof studentName !== "string") {
      throw new Error("Invalid student name");
    }

    const sql = `
      SELECT i.issue_id, b.book_title, s.student_name,
        DATE_FORMAT(i.issue_date, '%Y-%m-%d %H:%i:%s') AS issue_date,
        DATE_FORMAT(i.due_date, '%Y-%m-%d %H:%i:%s') AS due_date,
        DATE_FORMAT(i.return_date, '%Y-%m-%d %H:%i:%s') AS return_date,
        i.status
      FROM issue_book i
      LEFT JOIN book b ON i.book_id = b.book_id
      LEFT JOIN student s ON i.student_id = s.student_id
      WHERE s.student_name LIKE ?
      ORDER BY i.issue_date DESC
    `;

    const [BookList] = await db.execute(sql, [`%${studentName}%`]);
    return { BookList };
  } catch (err) {
    console.error("Error in searchIssuedBooksByStudentName (no pagination):", err);
    throw err;
  }
};



exports.searchReturnedBooksByStudentName = async (studentName) => {
  try {
    if (!studentName || typeof studentName !== "string" || studentName.trim() === "") {
      throw new Error("Invalid student name");
    }

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
        AND s.student_name LIKE ?
      ORDER BY i.return_date DESC
    `;

    const likeTerm = `%${studentName}%`;
    const [results] = await db.execute(sql, [likeTerm]);

    return {
      status: "success",
      total: results.length,
      data: results
    };
  } catch (err) {
    console.error("Error in searchReturnedBooksByStudentName (service):", err);
    throw err;
  }
};

/*search only issued books*/

exports.searchIssuedBooksOnlyByStudentName = async (studentName) => {
  try {
    if (!studentName || typeof studentName !== "string" || studentName.trim() === "") {
      throw new Error("Invalid student name");
    }

    const sql = `
      SELECT i.issue_id, b.book_title, s.student_name,
        DATE_FORMAT(i.issue_date, '%Y-%m-%d %H:%i:%s') AS issue_date,
        DATE_FORMAT(i.due_date, '%Y-%m-%d %H:%i:%s') AS due_date,
        DATE_FORMAT(i.return_date, '%Y-%m-%d %H:%i:%s') AS return_date,
        i.status
      FROM issue_book i
      LEFT JOIN book b ON i.book_id = b.book_id
      LEFT JOIN student s ON i.student_id = s.student_id
      WHERE i.status = "issued"
        AND s.student_name LIKE ?
      ORDER BY i.issue_date DESC
    `;

    const likeValue = `%${studentName}%`;
    const [results] = await db.execute(sql, [likeValue]);

    return {
      status: "success",
      total: results.length,
      data: results
    };
  } catch (err) {
    console.error("Error in searchIssuedBooksOnlyByStudentName:", err);
    throw err;
  }
};