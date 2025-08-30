let express=require("express");
let adminmodel=require("../controllers/admincontroller");
let usermodel=require("../controllers/adminusercontroller");
let admincategory=require("../controllers/admincategorycontroller");
let adminbook=require("../controllers/adminbookcontroller");
let issuedbook=require("../controllers/adminissuedbookcontroller");
let userinfo=require("../controllers/usercontroller.js");

let { verifyToken,  verifyAdmin} = require("../middleware/adminauth.js");
const { verifyToken1 } = require("../middleware/userauth.js");



let router=express.Router();
//Student Register
router.post("/register",usermodel.registerUser);
//Student Login
router.post("/login", usermodel.loginUser);





//home
router.get("/",adminmodel.homepage);
//view Student List
router.get("/viewstudent", usermodel.viewAllStudents);
//Delete Student
router.get("/deletestudent/:student_id", usermodel.deletestudent);
//Serach Student
router.get("/searchstudent",usermodel.searchStudents);
//Update Student
router.get("/student/:id",usermodel.getStudentById);   
router.put("/student/:id",usermodel.updateStudent);   



//Add Admin
router.post("/addadmin", adminmodel.saveAdmin);
//Admin Login
router.post("/adminLogin",adminmodel.adminLogin);


//Add Category
router.post("/addcategory",admincategory.addcategory);
//View Category
router.get("/viewcategory",admincategory.viewcategory);
//Delete Category
router.get("/deletecategory/:id",admincategory.deletecategory);
//Get Data For Updateing Data in Category
router.get("/category/:id", admincategory.getCategoryById);
// Update category
router.put("/category/:id", admincategory.updateCategory);
//Serach Category
router.get("/categories/search/", admincategory.searchCategoryByUsingName);


//Add Book
router.post("/addbook",adminbook.addnewbook);
//View Book
router.get("/viewallbooks",adminbook.viewallbooks);
//Delete Book
router.get("/deletebooks/:book_id", adminbook.deletebook);
//Get Data For Updateing Data in Book
router.get("/book/:id", adminbook.getBookById);

// ✅ Update book
router.put("/book/:id",adminbook.updateBook);

// ✅ Get all categories (for dropdown in update form)
router.get("/categories",adminbook.getAllCategories);
//Search Book
router.get("/searchbook", adminbook.searchBookByUsingName);



// issued book
// issued book
router.post("/addissuedbook",issuedbook.addissueBook);
router.get("/viewissueallbooks",issuedbook.viewissuedbooks);
router.get("/viewissueallbooksissued",issuedbook.viewissuedbooksissue);
router.get("/viewissueallbooksreturned",issuedbook.viewissuedbooksreturned);
// router.get("/viewissuedbooksByUser", issuedbook.viewissuedbooksByUser);
router.get("/viewissuedbooksByuseremail",issuedbook.viewissuedbooksByuseremail);

router.put('/issue-book/:issue_id/toggle-status', issuedbook.toggleIssueBookStatus);
router.get("/searchissuebookbystudentname", issuedbook.searchIssuedBooksByStudentName);
router.get("/returned-books/search", issuedbook.searchReturnedBooksByStudentName);

router.get("/search-only-issued-books",issuedbook.searchIssuedBooksOnlyByStudentName);

//Student Profile
router.get("/profile",verifyToken1,usermodel.getProfile);

router.get("/userviewbook",userinfo.userviewallbook);
router.get("/viewuserhistory",userinfo.viewuserhistorybyuserid);
router.get("/viewuserissuedbookbyid",userinfo.viewuserissuedbookbyid);
router.get("/viewuserreturnbookbyid",userinfo.viewuserreturnbookbyid);


module.exports = router;

