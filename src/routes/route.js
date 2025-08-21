let express=require("express");
let adminmodel=require("../controllers/admincontroller");
let usermodel=require("../controllers/adminusercontroller");
let admincategory=require("../controllers/admincategorycontroller");
let adminbook=require("../controllers/adminbookcontroller");
let issuedbook=require("../controllers/adminissuedbookcontroller");
let userinfo=require("../controllers/usercontroller.js");

let router=express.Router();

//login page
router.get("/",adminmodel.homepage);
router.post("/adduser",usermodel.Adduser);
router.get("/viewstudent", usermodel.viewallstudents);

router.get("/deletestudent/:student_id", usermodel.deletestudent);
router.get("/searchstudent", usermodel.searchstudentByUsingName);

router.post("/loginuser",usermodel.userlogin);

//admin
router.post("/loginadmin",adminmodel.adminlogin);


//category
router.post("/addcategory",admincategory.addcategory);
router.get("/viewcategory",admincategory.viewcategory);
router.get("/deletecategory/:id",admincategory.deletecategory);
router.post("/updatecategory",admincategory.updatecategory);
router.post("/finalupdatecategory",admincategory.FinalUpdatecategory);
// Better:
router.get("/categories/search/", admincategory.searchCategoryByUsingName);

//book

router.post("/addbook",adminbook.addnewbook);
router.get("/viewallbooks",adminbook.viewallbooks);
router.get("/deletebooks/:book_id", adminbook.deletebook);
router.post("/updatebook",adminbook.updatebook);
router.post("/Finalupdatebook",adminbook.finalupdatebook);
router.get("/searchbook", adminbook.searchbookByUsingName);

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

