const issuemodel = require('../models/adminissuedmodel');

exports.addissueBook = (req, res) => {
    const { book_id, student_id } = req.body;

    // if (!book_id || !student_id) {
    //     return res.status(400).json({ error: "book_id and student_id are required" });
    // }

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

exports.viewissuedbooksByUser = (req, res) => {
    const student_id = req.query.student_id;

    // console.log("📥 student_id received:", student_id);

    if (!student_id) {
        // console.log("❌ Missing student_id");
        return res.status(400).json({ error: "student_id query parameter is required" });
    }

    issuemodel.viewissuedbooksByUser(student_id)
        .then(books => {
            // console.log("📦 Books fetched from DB:", books);

            const grouped = {
                issued: [],
                returned: []
            };

            books.forEach(book => {
                const status = (book.status || '').toLowerCase();
                // console.log(`🔍 Book status: ${status}`);

                if (status === 'issued') {
                    grouped.issued.push(book);
                } else if (status === 'returned') {
                    grouped.returned.push(book);
                }
            });

            // console.log("✅ Grouped Output:", grouped);
            res.status(200).json(grouped);
        })
        .catch(error => {
            // console.error("🔥 Error:", error);
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




