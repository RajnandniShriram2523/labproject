 let usermodels=require("../models/usermodels.js");

// exports.userprofile = (req, res) => {
//     const student_id = req.query.student_id; // or req.query.id depending on how you're passing it

//     if (!student_id) {
//         return res.status(400).json({ error: "student_id is required" });
//     }

//     usermodel.userprofile(student_id)
//         .then(userprofile => {
//             if (!userprofile) {
//                 return res.status(404).json({ error: "Student not found" });
//             }
//             res.status(200).json(userprofile);
//         })
//         .catch(error => {
//             console.error("Error fetching user profile", error);
//             res.status(500).json({ error: "Internal Server Error" });
//         });
// };


exports.userviewallbook = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;

    const result = await usermodels.userviewallbook({
      page: parseInt(page),
      limit: parseInt(limit),
      search
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};








exports.getstudenthistory = async (req, res) => {
  try {
    const { studentId } = req.params;
    const issues = await usermodels.getByStudentId(studentId);

    res.json(issues);
  } catch (error) {
    console.error("Error fetching issue data:", error);
    res.status(500).json({ message: "Database error" });
  }
};













// controllers/studentController.js

// GET /students/issued/:studentId
exports.getIssuedBooks = async (req, res) => {
  try {
    // ✅ Use JWT middleware (req.user) if available, else fallback to params
    const studentId = req.user?.id || req.params.studentId;

    if (!studentId) {
      return res.status(400).json({
        status: "error",
        message: "Student ID is required",
      });
    }

    const books = await usermodels.onlyviewIssuedBooks(studentId); // call model

    res.json({
      status: "success",
      data: books,
    });
  } catch (err) {
    console.error("❌ Error fetching issued books:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch issued books",
    });
  }
};

























// GET /students/returned/:studentId
exports.getReturnedBooks = async (req, res) => {
  try {
    // ✅ Use JWT middleware (req.user) if available, else fallback to params
    const studentId = req.user?.id || req.params.studentId;

    if (!studentId) {
      return res.status(400).json({
        status: "error",
        message: "Student ID is required",
      });
    }

    const books = await usermodels.onlyviewReturnedBooks(studentId); // call model

    res.json({
      status: "success",
      data: books,
    });
  } catch (err) {
    console.error("❌ Error fetching returned books:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch returned books",
    });
  }
};
