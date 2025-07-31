let adminbookmodel=require("../models/adminbookcurdmodel");

exports.addnewbook = ((req, res) => {

  let { book_title,book_author,book_price,book_publish,category_id,status } = req.body;
  let promise = adminbookmodel.Addcategory(book_title,book_author,book_price,book_publish,category_id,status);
  promise.then((result) => {
    console.log(result);
    
    res.json({status:" book added", msg: result });
  }).catch((err) => {
    res.json({status:"book not added",  msg: err });
  });

});


exports.viewallbooks = (req, res) => {
  const page = parseInt(req.query.page) || 1;    
  const limit = parseInt(req.query.limit) || 5;  
  const offset = (page - 1) * limit;

  // const category_id = req.query.category_id; // ✅ Get category_id from query

  // if (!category_id) {
  //   return res.status(400).json({ status: "error", message: "category_id is required" });
  // }

  adminbookmodel.viewbookWithPagination( limit, offset)
    .then((result) => {
      res.json({
        status: "view",
        currentPage: page,
        perPage: limit,
        categorylist: result
      });
    })
    .catch((err) => {
      res.status(500).json({ status: "error", message: err });
    });
};


  

 exports.deletebook = (req, res) => {
  const book_id = parseInt(req.query.book_id);
  const page = parseInt(req.query.page) || 1; // fallback to page 1

  if (!book_id || isNaN(book_id)) {
    return res.status(400).json({ status: "error", message: "Invalid or missing book_id" });
  }

  adminbookmodel.deletebybookid(book_id, page)
    .then(booklist => {
      res.json({ status: "delete", booklist });
    })
    .catch(err => {
      res.status(500).json({ status: "error", message: err.message });
    });
};

// Show update form (possibly pre-filled with query data)
exports.updatebook = (req, res) => {
  res.json({
    status: "update",
    book_id: req.query.book_id,
    book_title: req.query.book_title,
    book_author: req.query.book_author,
    book_price: req.query.book_price,
    book_publish: req.query.book_publish,
    category_id: req.query.category_id,
    status: req.query.status
  });
};

exports.finalupdatebook = (req, res) => {
  // Extract all variables from req.body at the top
  const {
    book_id,
    book_title,
    book_author,
    book_price,
    book_publish,
    category_id,
    status
  } = req.body;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  if (!book_id || !book_title || !book_author) {
    return res.status(400).json({
      status: "error",
      message: "Missing required fields"
    });
  }

  const offset = (page - 1) * limit;

  adminbookmodel.finalupdatebook(
    book_id,
    book_title,
    book_author,
    book_price,
    book_publish,
    category_id,
    status
  )
  .then(updateResult => {
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "No book found with the given ID"
      });
    }
    return adminbookmodel.viewbookWithPagination(limit, offset);
  })
  .then(booklist => {
    res.json({
      status: "success",
      message: "Book updated successfully",
      page,
      limit,
      booklist
    });
  })
  .catch(err => {
    console.error("Update error:", err);
    res.status(500).json({
      status: "error",
      message: "Book not updated",
      error: err.message
    });
  });
};

exports.searchbookByUsingName = (req, res) => {
  let book_title = req.query.book_title || '';
  book_title = book_title.trim().replace(/^["']|["']$/g, '');

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  adminbookmodel.searchbookbyname(book_title, limit, offset)
    .then((result) => {
      res.json({
        status: "success",
        message: result.length 
          ? `Search results for '${book_title}'` 
          : `No results found for '${book_title}'`,
        page,
        limit,
        booklist: result
      });
    })
    .catch((err) => {
      console.error("Search error:", err);
      res.status(500).json({
        status: "error",
        message: "Something went wrong",
        error: err.message
      });
    });
};