let usermodel=require("../models/adminusermodel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const SECRET_KEY = process.env.JWT_SECRET || "Rajnandni@123";
// ✅ Register
exports.registerUser = async (req, res) => {
  try {
    const { student_name, student_email, student_password, study_year } = req.body;

    // check existing user
    const existingUser = await usermodel.findByEmail(student_email);
    if (existingUser) {
      return res.status(400).json({ status: "error", msg: "Email already registered" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(student_password, 10);

    // save user
    const result = await usermodel.addUser(student_name, student_email, hashedPassword, study_year);

    res.json({ status: "success", msg: "User registered successfully", data: result });
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ status: "error", msg: "Something went wrong" });
  }
};

// ✅ Login
exports.loginUser = async (req, res) => {
  try {
    const { student_email, student_password } = req.body;

    const user = await usermodel.findByEmail(student_email);
    if (!user) {
      return res.status(404).json({ status: "error", msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(student_password, user.student_password);
    if (!isMatch) {
      return res.status(401).json({ status: "error", msg: "Invalid password" });
    }

    // JWT token
    const token = jwt.sign(
      { id: user.student_id, email: user.student_email },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "1h" }
    );

    res.json({
      status: "success",
      msg: "Login successful",
      token,
      user: {
        id: user.student_id,
        name: user.student_name,
        email: user.student_email,
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ status: "error", msg: "Something went wrong" });
  }
};


exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // decoded from JWT

    const user = await usermodel.getUserById(userId);

    console.log("Decoded user:", req.user);
    console.log("Fetched user:", user);

    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    res.json({
      status: "success",
      profile: user
    });
  } catch (err) {
    console.error("getProfile error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};


exports.viewAllStudents = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 6);
    const offset = (page - 1) * limit;

    const { students, total } = await usermodel.viewStudentWithPagination(limit, offset);

    if (!students || students.length === 0) {
      return res.status(404).json({
        status: "empty",
        message: "No students found.",
        currentPage: page,
        totalPages: 0,
        studentList: [],
      });
    }

    res.status(200).json({
      status: "success",
      currentPage: page,
      perPage: limit,
      totalPages: Math.ceil(total / limit),
      studentList: students,
    });
  } catch (err) {
    console.error("Error in viewAllStudents:", err);
    res.status(500).json({
      status: "error",
      message: err.toString(),
    });
  }
};

// controller/studentController.js
exports.deletestudent = async (req, res) => {
  try {
    const student_id = Number(req.params.student_id);

    console.log("Student ID:", req.params.student_id);
    console.log("Parsed ID:", student_id);

    if (isNaN(student_id) || student_id <= 0) {
      return res.status(400).json({ status: "error", message: "Invalid or missing student_id" });
    }

    // Call model with pagination (page=1, limit=6 for refreshed list)
    const { rows, totalPages, currentPage } = await usermodel.deletebystudentid(student_id, 1, 6);

    res.json({ 
      status: "delete", 
      studentList: rows, 
      currentPage, 
      totalPages 
    });
  } catch (err) {
    console.error("Server error on delete:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};


















// exports.searchStudents = async (req, res) => {
//   const search = (req.query.search || "").trim();
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 6;

//   console.log("🔍 Search term:", search, "Page:", page, "Limit:", limit);
 
//   try {
//     console.log("========= student list=");
//     const students = await usermodel.searchByEmail(search, page, limit);
    
//     const totalCount = await usermodel.countStudentsForSearch(search);
//     console.log("========= student count="+totalCount);
//     res.json({
//       status: "success",
//       studentList: students,
//       currentPage: page,
//       totalPages: Math.ceil(totalCount / limit),
//     });
//   } catch (err) {
//     console.error("❌ Search error:", err);
//     res.status(500).json({ status: "error", message: "Search failed" });
//   }
// };

exports.searchStudents = async (req, res) => {
  const search = (req.query.search || "").trim();
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;

  try {
    const result = await usermodel.searchByEmail(search, page, limit);

    res.json({
      status: "success",
      ...result,   // spreads studentList, currentPage, totalPages, totalRecords
    });
  } catch (err) {
    console.error("❌ Search error:", err);
    res.status(500).json({ status: "error", message: "Search failed" });
  }
};






// ✅ Update Student Controller


// ✅ Fetch student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await usermodel.getStudentById(req.params.id);
    console.log(req.params.id)
    if (!student) {
      return res.status(404).json({ status: "error", message: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// ✅ Update student
exports.updateStudent = async (req, res) => {
  const { student_name, student_email, study_year } = req.body;
  const studentId = req.params.id;

  try {
    const result = await usermodel.updateStudent(studentId, student_name, student_email, study_year);

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: "error", message: "Student not found" });
    }

    res.json({
      status: "success",
      message: "Student updated successfully",
      student: { student_id: studentId, student_name, student_email, study_year },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};



























// exports.userlogin = (req, res) => {
//   const {student_email,student_password} = req.body;

//  let promise = usermodel.userData(student_email,student_password);
//     promise.then((result) => {
//         console.log("valid");
//       res.json({ status: "valid", msg: result });
//     })
//     .catch((err) => {
//          console.log("Invalid");
//       res.json({ status: "invalid", msg: err });
//     });
// };