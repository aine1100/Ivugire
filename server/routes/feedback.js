const express = require('express');
const router=express.Router();
const feedBackController=require("../controller/feedback")
const verifyAdmin=require("../middleware/AdminAuth")

router.post("/submit",feedBackController.createFeedBack)
router.get("/all",verifyAdmin,feedBackController.getAllFeedBack)
router.get("/:id",verifyAdmin,feedBackController.getFeedBackById)


module.exports=router