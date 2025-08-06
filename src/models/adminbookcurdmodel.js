let db = require("../../db.js");




exports.Addbook = (book_title,book_author,book_price,book_published_date,isbn_code,category_id,status) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO book VALUES('0',?,?,?,?,?,?,?)", [book_title,book_author,book_price,book_published_date,isbn_code,category_id,status], (err, result) => {
            if (err) {
                reject("Not saved: " + err);
            } else {
                resolve("book saved successfully.");
            }
        });
    });
};

exports.viewbookWithPagination = ( limit, offset) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        b.book_id, b.book_title, b.book_author, b.book_price, 
        b.book_published_date,b.isbn_code, c.category_name, b.status 
      FROM 
        book b 
      INNER JOIN 
        category c ON b.category_id = c.category_id 
      
        
      LIMIT ? OFFSET ?`;

    db.query(sql, [ limit, offset], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};




exports.deletebybookid = (book_id, page = 1) => {
  return new Promise((resolve, reject) => {
    if (!book_id || isNaN(book_id)) {
      return reject(new Error("Invalid book_id"));
    }

    const limit = 10;
    const offset = (page - 1) * limit;

    db.query("DELETE FROM book WHERE book_id = ?", [book_id], (err, result) => {
      if (err) {
        return reject(err);
      }

      if (result.affectedRows === 0) {
        return reject(new Error("No book found with the given ID."));
      }

      db.query("SELECT * FROM book LIMIT ? OFFSET ?", [limit, offset], (err, rows) => {
        if (err) {
          return reject(err);
        }

        resolve(rows);
      });
    });
  });
};

exports.finalupdatebook = (book_id, book_title, book_author, book_price,book_published_date,isbn_code, category_id, status) => {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE book SET 
        book_title = ?, 
        book_author = ?, 
        book_price = ?, 
       book_published_date=?,
       isbn_code=?,
        category_id = ?, 
        status = ?
       WHERE book_id = ?`,
      [book_title, book_author, book_price, book_published_date,isbn_code, category_id, status, book_id],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};


exports.searchbookbyname = (book_title, limit, offset) => {
  return new Promise((resolve, reject) => {
    const searchTerm = `%${book_title}%`;
    db.query(
      "SELECT * FROM book WHERE book_title LIKE ? LIMIT ? OFFSET ?", 
      [searchTerm, limit, offset], 
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};