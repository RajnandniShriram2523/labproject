let express=require("express");
let adminmodel=require("../controllers/admincontroller");
let admincategory=require("../controllers/admincategorycontroller");

// let adminbook=require("../controllers/adminbookcontroller");

let router=express.Router();

router.get("/",adminmodel.homepage);


router.post("/addcategory",admincategory.addcategory);
/*
router.get("/viewcategory",admincategory.viewcategory);
router.post("/deletecategory",admincategory.deletecategory);
router.post("/updatecategory",admincategory.updatecategory);
router.post("/finalupdatecategory",admincategory.FinalUpdatecategory);
router.post("/searchcategory",admincategory.serachcategoryByUsingName);

*/




module.exports = router;

