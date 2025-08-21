let usermodel=require("../models/adminusermodel.js");

const userModel = require('../models/usermodel'); // example import path

exports.Adduser = (req, res) => {
  let { student_name, student_email, student_password, study_year } = req.body;

  let promise = usermodel.Adduser(student_name, student_email, student_password, study_year);

  promise
    .then((result) => {
      console.log("✅ User added:", result);
      res.json({ status: "add", msg: result });
      // remove resolve here
    })
    .catch((err) => {
      console.error("❌ Error adding user:", err);
      res.json({ status: "not add", msg: err });
      // remove reject here
    });
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