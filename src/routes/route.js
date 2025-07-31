let express=require("express");
let adminmodel=require("../controllers/admincontroller");
let usermodel=require("../controllers/usercontroller");
let admincategory=require("../controllers/admincategorycontroller");
let adminbook=require("../controllers/adminbookcontroller");

let router=express.Router();
//login page
router.get("/",adminmodel.homepage);
router.post("/loginadmin",adminmodel.adminlogin);
router.post("/loginuser",usermodel.userlogin);


//category
router.post("/addcategory",admincategory.addcategory);
router.get("/viewcategory",admincategory.viewcategory);
router.get("/deletecategory",admincategory.deletecategory);
router.post("/updatecategory",admincategory.updatecategory);
router.post("/finalupdatecategory",admincategory.FinalUpdatecategory);
router.post("/searchcategory",admincategory.serachcategoryByUsingName);

//book

router.post("/addbook",adminbook.addnewbook);
router.get("/viewallbooks",adminbook.viewallbooks);
router.get("/deletebooks",adminbook.deletebook);
router.post("/updatebook",adminbook.updatebook);
router.post("/Finalupdatebook",adminbook.finalupdatebook);
router.post("/searchbook",adminbook.searchbookByUsingName);



module.exports = router;

