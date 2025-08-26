// let usermodel = require("../models/usermodel");//

exports.userprofile = (req, res) => {
    const student_id = req.query.student_id; // or req.query.id depending on how you're passing it

    if (!student_id) {
        return res.status(400).json({ error: "student_id is required" });
    }

    usermodel.userprofile(student_id)
        .then(userprofile => {
            if (!userprofile) {
                return res.status(404).json({ error: "Student not found" });
            }
            res.status(200).json(userprofile);
        })
        .catch(error => {
            console.error("Error fetching user profile", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
};
exports.userviewallbook = (req, res) => {
    usermodel.userviewallbook()
        .then(userbooks => {
            if (!userbooks) {
                return res.status(404).json({ error: "not show book" });
            }
            res.status(200).json(userbooks);
        })
        .catch(error => {
            console.error("Error fetching book", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
};




exports.viewuserhistorybyuserid = (req, res) => {
  const student_id = req.query.student_id;

  if (!student_id || isNaN(student_id)) {
    return res.status(400).json({ error: "Invalid or missing student_id" });
  }

  usermodel.viewuserhistorybyuserid(student_id)
    .then(userinfo => {
      if (!userinfo || userinfo.length === 0) {
        return res.status(404).json({ message: "No records found for this student ID" });
      }

      // Group the issued books and student info
      const firstRecord = userinfo[0];
      const studentData = {
        studentId: firstRecord.student_id,
        studentName: firstRecord.student_name,
        studentEmail: firstRecord.student_email,
        studyYear: firstRecord.study_year,
        issuedBooks: userinfo
          .filter(record => record.book_title)  // Filter out if no book issued
          .map(record => ({
            categoryName: record.category_name,
            bookTitle: record.book_title,
            issueDate: record.issue_date,
            dueDate: record.due_date,
            returnDate: record.return_date,
            status: record.status
          }))
      };

      res.status(200).json(studentData);
    })
    .catch(error => {
      console.error("Error fetching student info:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};


exports.viewuserissuedbookbyid= (req, res) => {
  const student_id = req.query.student_id;

  if (!student_id || isNaN(student_id)) {
    return res.status(400).json({ error: "Invalid or missing student_id" });
  }

  usermodel.viewuserissuedbookbyid(student_id)
    .then(userinfo => {
      if (!userinfo || userinfo.length === 0) {
        return res.status(404).json({ message: "No issued books found for this student ID" });
      }

      // Group the issued books and student info
      const firstRecord = userinfo[0];
      const studentData = {
        studentId: firstRecord.student_id,
        studentName: firstRecord.student_name,
        studentEmail: firstRecord.student_email,
        studyYear: firstRecord.study_year,
        issuedBooks: userinfo.map(record => ({
          categoryName: record.category_name,
          bookTitle: record.book_title,
          issueDate: record.issue_date,
          dueDate: record.due_date,
          returnDate: record.return_date,
          status: record.status
        }))
      };

      res.status(200).json(studentData);
    })
    .catch(error => {
      console.error("Error fetching issued books:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};


exports.viewuserreturnbookbyid= (req, res) => {
  const student_id = req.query.student_id;

  if (!student_id || isNaN(student_id)) {
    return res.status(400).json({ error: "Invalid or missing student_id" });
  }

  usermodel.viewuserreturnbookbyid(student_id)
    .then(userinfo => {
      if (!userinfo || userinfo.length === 0) {
        return res.status(404).json({ message: "No issued books found for this student ID" });
      }

      // Group the issued books and student info
      const firstRecord = userinfo[0];
      const studentData = {
        studentId: firstRecord.student_id,
        studentName: firstRecord.student_name,
        studentEmail: firstRecord.student_email,
        studyYear: firstRecord.study_year,
        issuedBooks: userinfo.map(record => ({
          categoryName: record.category_name,
          bookTitle: record.book_title,
          issueDate: record.issue_date,
          dueDate: record.due_date,
          returnDate: record.return_date,
          status: record.status
        }))
      };

      res.status(200).json(studentData);
    })
    .catch(error => {
      console.error("Error fetching issued books:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};
