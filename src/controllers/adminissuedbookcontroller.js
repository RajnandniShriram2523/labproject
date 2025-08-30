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








exports.toggleIssueBookStatus = async (req, res) => {
  const issue_id = req.params.issue_id;

  try {
    const newStatus = await issuemodel.toggleIssueBookStatus(issue_id);

    res.status(200).json({
      status: "success",
      message: `Book status updated to '${newStatus}'`,
      newStatus,
    });
  } catch (err) {
    console.error("Toggle error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to update book status",
      error: err.message,
    });
  }
};








exports.viewissuedbooksissue = async (req, res) => {
  try {
    const limit = req.query.limit || 5;
    const offset = req.query.offset || 0;

    const result = await issuemodel.viewissuedbooksisssued(limit, offset);

    res.status(200).json(result);

  } catch (error) {
    console.error("Error in getIssuedBooks controller:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
};











exports.viewissuedbooksreturned = (req, res) => {
    // Get pagination values from query params with default values
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    if (page < 1 || limit < 1) {
        return res.status(400).json({ error: "Page and limit must be positive integers" });
    }

    const offset = (page - 1) * limit;

    // Now pass limit and offset in correct order
    issuemodel.viewissuedbooksreturned(limit, offset)
        .then(issuedBooks => {
            res.status(200).json({
                page,
                limit,
                ...issuedBooks // unpack pagination details from model
            });
        })
        .catch(error => {
            console.error("Error fetching issued books:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
};





exports.viewissuedbooksByuseremail = async (req, res) => {
  const student_email = req.query.student_email;

  if (!student_email) {
    return res.status(400).json({ error: "student_email query parameter is required" });
  }

  try {
    const result = await issuemodel.viewissuedbooksByUseremail(student_email);

    res.status(200).json({
      status: result.status,
      totalItems: result.totalItems,
      data: result.data,
    });
  } catch (error) {
    console.error("Error fetching issued books:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



/*search issue book by student_name*/



exports.searchIssuedBooksByStudentName = async (req, res) => {
  const studentName = req.query.student_name;

  if (!studentName) {
    return res.status(400).json({
      status: "error",
      message: "Missing student_name in query",
    });
  }

  try {
    const data = await issuemodel.searchIssuedBooksByStudentName(studentName);

    res.status(200).json({
      status: "success",
      student_name: studentName,
      totalItems: data.BookList.length,
      BookList: data.BookList,
    });
  } catch (error) {
    console.error("Error in searchIssuedBooksByStudentName:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};


/*search returned books by student_name*/



exports.searchReturnedBooksByStudentName = async (req, res) => {
  try {
    const studentName = req.query.student_name || req.query.studentName;

    if (!studentName || typeof studentName !== "string" || studentName.trim() === "") {
      return res.status(400).json({ status: "error", message: "student_name is required." });
    }

    const result = await issuemodel.searchReturnedBooksByStudentName(studentName);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Controller error - searchReturnedBooksByStudentName:", error);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
};



/*search olny issued books*/


exports.searchIssuedBooksOnlyByStudentName = async (req, res) => {
  try {
    const studentName = req.query.student_name || req.query.studentName;

    if (!studentName || typeof studentName !== "string" || studentName.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "student_name is required"
      });
    }

    const result = await issuemodel.searchIssuedBooksOnlyByStudentName(studentName);

    res.status(200).json(result);
  } catch (error) {
    console.error("Controller error - searchIssuedBooksOnlyByStudentName:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
};