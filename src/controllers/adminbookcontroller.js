let adminbookmodel=require("../models/adminbookcurdmodel");

exports.addnewbook = ((req, res) => {

  let { book_title,book_author,book_price,book_published_date,isbn_code,category_id,status } = req.body;
  let promise = adminbookmodel.Addbook(book_title,book_author,book_price,book_published_date,isbn_code,category_id,status);
  promise.then((result) => {
    console.log(result);
    
    res.json({status:"Book Added Successfully", msg: result });
  }).catch((err) => {
    res.json({status:"❗ Book Not Added ",  msg: err });
  });

});


exports.viewallbooks = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  adminbookmodel.viewbookWithPagination(limit, offset)
    .then(({ books, total }) => {
      res.json({
        status: "success",
        currentPage: page,
        perPage: limit,
        totalPages: Math.ceil(total / limit),
        BookList: books    // ✅ Correct key
      });
    })
    .catch((err) => {
      res.status(500).json({ status: "error", message: err.toString() });
    });
};




exports.deletebook = (req, res) => {
  const book_id = parseInt(req.params.book_id);
  const page = parseInt(req.query.page) || 1;

  if (!book_id || isNaN(book_id)) {
    return res.status(400).json({ status: "error", message: "Invalid or missing book_id" });
  }

  adminbookmodel.deletebybookid(book_id, page)
    .then(({ rows, totalPages }) => {
      res.json({ status: "delete", BookList: rows, currentPage: page, totalPages });
    })
    .catch(err => {
      res.status(500).json({ status: "error", message: err.message });
    });
};



// 🔍 Search books with pagination





// ✅ Controller: Search books by title
exports.searchBookByUsingName = async (req, res) => {
  try {
    let { book_title = "", page = 1, limit = 5 } = req.query;

    page = Number(page) || 1;
    limit = Number(limit) || 5;
    const offset = (page - 1) * limit;

    let books, total;

    if (book_title.trim() === "") {
      // 📚 Show ALL books (view all)
      books = await adminbookmodel.getAllBooks(limit, offset);
      total = await adminbookmodel.countAllBooks();
    } else {
      // 🔍 Search by book title
      books = await adminbookmodel.searchBookByName(book_title, limit, offset);
      total = await adminbookmodel.countBooksByTitle(book_title);
    }

    res.json({
      status: "success",
      data: books,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong while searching books",
      error: err.message,
    });
  }
};




























































// GET Book by ID
exports.getBookById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ status: "error", message: "Book ID is required" });

    const book = await adminbookmodel.getBookById(id);
    if (!book) return res.status(404).json({ status: "error", message: "Book not found" });

    return res.status(200).json(book);
  } catch (err) {
    console.error("getBookById error:", err);
    return res.status(500).json({ status: "error", message: "Failed to fetch book", error: err.message });
  }
};

// PUT /book/:id
exports.updateBook = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ status: "error", message: "Book ID is required" });

    const {
      book_title,
      book_author,
      book_price,
      book_published_date,
      isbn_code,
      category_id,
      status
    } = req.body;

    if (!book_title || !book_author) {
      return res.status(400).json({ status: "error", message: "Missing required fields" });
    }

    const result = await adminbookmodel.updateBook(id, {
      book_title,
      book_author,
      book_price,
      book_published_date,
      isbn_code,
      category_id,
      status
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: "error", message: "Book not found" });
    }

    return res.status(200).json({ status: "success", message: "Book updated successfully" });
  } catch (err) {
    console.error("updateBook error:", err);
    return res.status(500).json({ status: "error", message: "Book not updated", error: err.message });
  }
};

// GET /categories
exports.getAllCategories = async (_req, res) => {
  try {
    const rows = await adminbookmodel.getAllCategories();
    return res.status(200).json({ CategoryList: rows });
  } catch (err) {
    console.error("getAllCategories error:", err);
    return res.status(500).json({ status: "error", message: "Failed to fetch categories", error: err.message });
  }
};
