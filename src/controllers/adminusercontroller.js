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








exports.viewallstudents = (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 6);
  const offset = (page - 1) * limit;
usermodel.viewstudentWithPagination(limit, offset)
    .then(({ student, total }) => {
      if (!student || student.length === 0) {
        return res.status(404).json({
          status: "empty",
          message: "No students found.",
          currentPage: page,
          totalPages: 0,
          studentList: []
        });
      }

      res.json({
        status: "success",
        currentPage: page,
        perPage: limit,
        totalPages: Math.ceil(total / limit),
        studentList: student
      });
    })
    .catch(err => {
      res.status(500).json({ status: "error", message: err.toString() });
    });
};





















exports.deletestudent = (req, res) => {
  const student_id = Number(req.params.student_id);

  console.log("Student ID:", req.params.student_id);
  console.log("Parsed ID:", student_id);

  if (isNaN(student_id) || student_id <= 0) {
    return res.status(400).json({ status: "error", message: "Invalid or missing student_id" });
  }

  usermodel.deletebystudentid(student_id)
    .then(({ rows, totalPages, currentPage }) => {
      res.json({ status: "delete", studentList: rows, currentPage, totalPages });
    })
    .catch(err => {
      console.error("Server error on delete:", err);
      res.status(500).json({ status: "error", message: err.message });
    });
};


exports.searchstudentByUsingName = async (req, res) => {
  let search = req.query.search || ""; // search term
  search = search.trim();

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  try {
    // 🔹 Fetch students matching name OR email
    const studentList = await usermodel.searchstudent(search, limit, offset);

    // 🔹 Count total results
    const totalCount = await usermodel.countStudents(search);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      status: "success",
      studentList,
      currentPage: page,
      totalPages,
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: err.message,
    });
  }
};







// Corrected and updated controller for searching students by name













exports.userlogin = (req, res) => {
  const {student_email,student_password} = req.body;

 let promise = usermodel.userData(student_email,student_password);
    promise.then((result) => {
        console.log("valid");
      res.json({ status: "valid", msg: result });
    })
    .catch((err) => {
         console.log("Invalid");
      res.json({ status: "invalid", msg: err });
    });
};