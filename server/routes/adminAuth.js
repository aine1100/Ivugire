const express=require("express")
const router=express.Router()
const adminController=require("../controller/adminAuth")

router.post("/register",adminController.registerAdmin)
router.post("/login",adminController.loginAdmin)
router.post("/logout",adminController.logout)

module.exports=router 