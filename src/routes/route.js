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
//student login
router.post("/register",usermodel.registerUser);
router.post("/login", usermodel.loginUser);




//login page
router.get("/",adminmodel.homepage);
// router.post("/adduser",usermodel.Adduser);
router.get("/viewstudent", usermodel.viewallstudents);

router.get("/deletestudent/:student_id", usermodel.deletestudent);
router.get("/searchstudent", usermodel.searchstudentByUsingName);

router.post("/loginuser",usermodel.userlogin);

//admin
router.post("/addadmin", adminmodel.saveAdmin);
router.post("/adminLogin",adminmodel.adminLogin);


//category
router.post("/addcategory",admincategory.addcategory);
router.get("/viewcategory",admincategory.viewcategory);
router.get("/deletecategory/:id",admincategory.deletecategory);
router.get("/category/:id", admincategory.getCategoryById);

// Update category
router.put("/category/:id", admincategory.updateCategory);
router.get("/categories/search/", admincategory.searchCategoryByUsingName);

//book

router.post("/addbook",adminbook.addnewbook);
router.get("/viewallbooks",adminbook.viewallbooks);
router.get("/deletebooks/:book_id", adminbook.deletebook);
router.get("/book/:id", adminbook.getBookById);
router.put("/book/:id", adminbook.updateBook);

// --- CATEGORY ROUTES (for dropdown) ---
router.get("/categories", adminbook.getAllCategories);

router.get("/searchbook", adminbook.searchBookByUsingName);

// issued book
router.post("/addissuedbook",issuedbook.addissueBook);
router.get("/viewissueallbooks",issuedbook.viewissuedbooks);
router.get("/viewissueallbooksissued",issuedbook.viewissuedbooksissue);
router.get("/viewissueallbooksreturned",issuedbook.viewissuedbooksreturned);
router.get("/viewissuedbooksByUser", issuedbook.viewissuedbooksByUser);
router.get("/viewissuedbooksByuseremail",issuedbook.viewissuedbooksByuseremail);


//student info
router.get("/userprofile",userinfo.userprofile);
router.get("/userviewbook",userinfo.userviewallbook);
router.get("/viewuserhistory",userinfo.viewuserhistorybyuserid);
router.get("/viewuserissuedbookbyid",userinfo.viewuserissuedbookbyid);
router.get("/viewuserreturnbookbyid",userinfo.viewuserreturnbookbyid);


module.exports = router;

