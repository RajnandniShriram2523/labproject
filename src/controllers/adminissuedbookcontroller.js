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
    issuemodel.viewissuedbooks()
        .then(issuedBooks => {
            res.status(200).json(issuedBooks);
        })
        .catch(error => {
            console.error("Error fetching issued books:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
};

exports.viewissuedbooksissue = (req, res) => {
    const status = req.query.status;
    issuemodel.viewissuedbooksisssued(status)
        .then(issuedBooks => {
            res.status(200).json(issuedBooks);
        })
        .catch(error => {
            console.error("Error fetching issued books:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
};

exports.viewissuedbooksreturned = (req, res) => {
    const status = req.query.status;
    issuemodel.viewissuedbooksreturned(status)
        .then(issuedBooks => {
            res.status(200).json(issuedBooks);
        })
        .catch(error => {
            console.error("Error fetching issued books:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
};

exports.viewissuedbooksByUser = (req, res) => {
    const student_id = req.query.student_id;
    if (!student_id) {
        return res.status(400).json({ error: "student_id query parameter is required" });
    }
    issuemodel.viewissuedbooksByUser(student_id)
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
            res.status(200).json(grouped);
        })
        .catch(error => {
            res.status(500).json({ error: "Internal Server Error" });
        });
};


exports.viewissuedbooksByuseremail = (req, res) => {
    const user_email = req.query.student_email;
    issuemodel.viewissuedbooksByUseremail(user_email)
        .then(issuedBooks => {
            res.status(200).json(issuedBooks);
        })
        .catch(error => {
            console.error("Error fetching issued books:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
};




