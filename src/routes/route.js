let express=require("express");
let adminctrl=require("../controllers/admincontroller.js")

let router=express.Router();
router.get("/",adminctrl.homepage);

router.post("/addcategory",adminctrl.addcategory);
router.get("/viewcategory",adminctrl.viewcategory);
router.post("/deletecategory",adminctrl.deletecategory);
router.post("/updatecategory",adminctrl.updatecategory);
router.post("/finalupdatecategory",adminctrl.FinalUpdatecategory);
router.post("/searchcategory",adminctrl.serachcategoryByUsingName);






module.exports = router;

