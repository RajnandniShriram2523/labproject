const issuemodel = require('../models/adminissuedmodel');

exports.addissueBook = (req, res) => {
    const { book_id, student_id } = req.body;
    issuemodel.issueBook({ book_id, student_id })
        .then(result => {
            res.status(201).json({
                message: "Book issued successfully",
                issue_id: result.insertId
            });
        })
        .catch(err => {
            console.error("Error issuing book:", err);
            res.status(500).json({ error: "Internal Server Error" });
        });
};


// exports.viewissuedbooks = (req, res) => {
//     issuemodel.viewissuedbooks()
//         .then(issuedBooks => {
//             res.status(200).json(issuedBooks);
//         })
//         .catch(error => {
//             console.error("Error fetching issued books:", error);
//             res.status(500).json({ error: "Internal Server Error" });
//         });
// };

exports.viewissuedbooks = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    issuemodel.viewissuedbooks(limit, offset)
        .then(data => {
            const totalPages = Math.ceil(data.total / limit);
            res.status(200).json({
                status: "success",
                currentPage: page,
                perPage: limit,
                totalItems: data.total,
                totalPages: totalPages,
                BookList: data.BookList  // Includes both "issued" and "returned" entries
            });
        })
        .catch(error => {
            console.error("Error fetching issued books:", error);
            res.status(500).json({ 
                status: "error",
                message: "Internal Server Error"
            });
        });
};



// exports.viewissuedbooksissue = (req, res) => {
//     const status = req.query.status;
//     issuemodel.viewissuedbooksisssued(status)
//         .then(issuedBooks => {
//             res.status(200).json(issuedBooks);
//         })
//         .catch(error => {
//             console.error("Error fetching issued books:", error);
//             res.status(500).json({ error: "Internal Server Error" });
//         });
// };

exports.viewissuedbooksissue = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  issuemodel.viewissuedbooksisssued(limit, offset)
    .then(data => {
      const totalPages = Math.ceil(data.total / limit);
      res.status(200).json({
        status: "success",
        currentPage: page,
        perPage: limit,
        totalItems: data.total,
        totalPages: totalPages,
        BookList: data.BookList
      });
    })
    .catch(error => {
      console.error("Error in controller:", error);
      res.status(500).json({ status: "error", message: error.message || "Internal Server Error" });
    });
};



// exports.viewissuedbooksreturned = (req, res) => {
//     const status = req.query.status;
//     issuemodel.viewissuedbooksreturned(status)
//         .then(issuedBooks => {
//             res.status(200).json(issuedBooks);
//         })
//         .catch(error => {
//             console.error("Error fetching issued books:", error);
//             res.status(500).json({ error: "Internal Server Error" });
//         });
// };

exports.viewissuedbooksreturned = (req, res) => {
    // Get pagination values from query params with default values
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Basic validation
    if (page < 1 || limit < 1) {
        return res.status(400).json({ error: "Page and limit must be positive integers" });
    }

    // Call the model with pagination
    issuemodel.viewissuedbooksreturned(page, limit)
        .then(issuedBooks => {
            res.status(200).json({
                page,
                limit,
                data: issuedBooks
            });
        })
        .catch(error => {
            console.error("Error fetching issued books:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
};


// exports.viewissuedbooksByUser = (req, res) => {
//     const student_id = req.query.student_id;
//     if (!student_id) {
//         return res.status(400).json({ error: "student_id query parameter is required" });
//     }
//     issuemodel.viewissuedbooksByUser(student_id)
//         .then(books => {

//             const grouped = {
//                 issued: [],
//                 returned: []
//             };
//             books.forEach(book => {
//                 const status = (book.status || '').toLowerCase();
//                 if (status === 'issued') {
//                     grouped.issued.push(book);
//                 } else if (status === 'returned') {
//                     grouped.returned.push(book);
//                 }
//             });
//             res.status(200).json(grouped);
//         })
//         .catch(error => {
//             res.status(500).json({ error: "Internal Server Error" });
//         });
// };

exports.viewissuedbooksByUser = (req, res) => {
    const student_id = req.query.student_id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!student_id) {
        return res.status(400).json({ error: "student_id query parameter is required" });
    }

    issuemodel.viewIssuedBooksByUser(student_id, page, limit)
        .then(books => {
            const grouped = {
                issued: [],
                returned: []
            };

            books.forEach(book => {
                const status = (book.status || '').toLowerCase();
                if (status === 'issued') {
                    grouped.issued.push(book);
                } else if (status === 'returned') {
                    grouped.returned.push(book);
                }
            });

            res.status(200).json({
                page,
                limit,
                totalFetched: books.length,
                data: grouped
            });
        })
        .catch(error => {
            console.error("Error fetching issued books:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
};



// exports.viewissuedbooksByuseremail = (req, res) => {
//     const user_email = req.query.student_email;
//     issuemodel.viewissuedbooksByUseremail(user_email)
//         .then(issuedBooks => {
//             res.status(200).json(issuedBooks);
//         })
//         .catch(error => {
//             console.error("Error fetching issued books:", error);
//             res.status(500).json({ error: "Internal Server Error" });
//         });
// };

exports.viewissuedbooksByuseremail = (req, res) => {
    const student_email = req.query.student_email;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;

    if (!student_email) {
        return res.status(400).json({ error: "student_email query parameter is required" });
    }

    issuemodel.viewissuedbooksByUseremail(student_email, page, limit)
        .then(result => {
            res.status(200).json({
                currentPage: result.currentPage,
                totalPages: result.totalPages,
                totalRecords: result.totalRecords,
                data: result.data
            });
        })
        .catch(error => {
            console.error("Error fetching issued books:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
};