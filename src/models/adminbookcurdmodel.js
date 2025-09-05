let db = require("../../db.js");




// Add a new book
exports.Addbook = async (
  book_title,
  book_author,
  book_price,
  book_published_date,
  isbn_code,
  category_id,
  status
) => {
  try {
    const sql = `
      INSERT INTO book 
      (book_id, book_title, book_author, book_price, book_published_date, isbn_code, category_id, status) 
      VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      book_title,
      book_author,
      book_price,
      book_published_date,
      isbn_code,
      category_id,
      status,
    ]);

    return "Book saved successfully.";
  } catch (err) {
    throw new Error("Not saved: " + err.message);
  }
};


    
// View books with pagination
exports.viewbookWithPagination = async (limit, offset) => {
  try {
    const sql = `
      SELECT b.book_id, b.book_title, b.book_author, b.book_price,
             b.book_published_date, b.isbn_code, c.category_name, b.status
      FROM book b
      INNER JOIN category c ON b.category_id = c.category_id
      LIMIT ? OFFSET ?
    `;

    // Fetch books with pagination
    const [books] = await db.query(sql, [limit, offset]);

    // Fetch total number of books
    const [countRes] = await db.query("SELECT COUNT(*) AS total FROM book");

    return {
      books,
      total: countRes[0].total
    };
  } catch (err) {
    throw err;
  }
};
exports.getAllBooks = async () => {
  try {
    const sql = `
      SELECT b.book_id, b.book_title, b.book_author, b.book_price,
             b.book_published_date, b.isbn_code, c.category_name, b.status
      FROM book b
      INNER JOIN category c ON b.category_id = c.category_id
    `;
    const [rows] = await db.query(sql);
    return rows;
  } catch (err) {
    throw err;
  }
};

exports.countAllBooks = async () => {
  try {
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM book");
    return rows[0].total;
  } catch (err) {
    throw err;
  }
};


// Delete a book by ID and return paginated data
exports.deletebybookid = async (book_id, page = 1) => {
  if (!book_id || isNaN(book_id)) {
    throw new Error("Invalid book_id");
  }

  const limit = 6;
  const offset = (page - 1) * limit;

  try {
    // Delete the book
    const [result] = await db.query("DELETE FROM book WHERE book_id = ?", [book_id]);

    if (result.affectedRows === 0) {
      throw new Error("No book found with the given ID.");
    }

    // Get total count after deletion
    const [countResult] = await db.query("SELECT COUNT(*) AS count FROM book");
    const totalCount = countResult[0].count;
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch current page data
    const [rows] = await db.query("SELECT * FROM book LIMIT ? OFFSET ?", [limit, offset]);

    return { rows, totalPages };
  } catch (err) {
    throw err;
  }
};




// 🔍 Search books by title


// 🔍 Search books by title
// Search books by title


// ✅ Search books by title with pagination
exports.searchBookByName = async (book_title, limit, offset) => {
  try {
    const searchTerm = `%${book_title}%`;
    const [rows] = await db.query(
      "SELECT * FROM book WHERE book_title LIKE ? LIMIT ? OFFSET ?",
      [searchTerm, Number(limit), Number(offset)]
    );
    return rows;
  } catch (err) {
    throw err;
  }
};

// ✅ Count total matching books (for pagination)
exports.countBooksByTitle = async (book_title) => {
  try {
    const searchTerm = `%${book_title}%`;
    const [rows] = await db.query(
      "SELECT COUNT(*) AS total FROM book WHERE book_title LIKE ?",
      [searchTerm]
    );
    return rows[0].total;
  } catch (err) {
    throw err;
  }
};





// ✅ Get single book by ID































// ✅ Get book by ID
exports.getBookById = async (bookId) => {
  const [rows] = await db.query(
    `SELECT b.*, c.category_name 
     FROM book b 
     LEFT JOIN category c ON b.category_id = c.category_id 
     WHERE b.book_id = ?`,
    [bookId]
  );
  return rows[0]; // return single book
};

// ✅ Update book
exports.updateBook = async (bookId, book_title, book_author, book_price, book_published_date, isbn_code, category_id, status) => {
  const [result] = await db.query(
    `UPDATE book SET 
      book_title = ?, 
      book_author = ?, 
      book_price = ?, 
      book_published_date = ?, 
      isbn_code = ?, 
      category_id = ?, 
      status = ?
     WHERE book_id = ?`,
    [book_title, book_author, book_price, book_published_date, isbn_code, category_id, status, bookId]
  );
  return result;
};

// ✅ Get all categories (for dropdown)
exports.getAllCategories = async () => {
  const [rows] = await db.query(`SELECT * FROM category`);
  return rows;
};
