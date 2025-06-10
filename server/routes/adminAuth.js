const express=require("express")
const router=express.Router()
const adminController=require("../controller/adminAuth")

router.post("/register",adminController.registerAdmin)
router.post("/login",adminController.loginAdmin)
router.post("/logout",adminController.logout)
router.post("/refreshtoken",adminController.handleRefreshToken)
router.post('/request-reset-password',adminController.RequestResetPassword);
router.post('/admin/reset-password/:token', adminController.ResetPassword);


module.exports=router 