const express = require('express');
const router=express.Router();
const complaintController=require("../controller/complaint")
const verifyAdmin=require("../middleware/AdminAuth")


router.post("/submit",complaintController.createComplaint)
router.get("/all",verifyAdmin,complaintController.getAllComplaints)
router.get("/tracking/:trackingCode",complaintController.getComplaintbyTrackingId)
router.put("/update/:id",verifyAdmin,complaintController.updateComplaintStatus)
router.get("/statistics",verifyAdmin,complaintController.getComplaintStatistics)
module.exports=router