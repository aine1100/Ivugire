const express=require("express")
const router=express.Router()
const LeaderController=require("../controller/Leaders")
const leaderAuth=require("../controller/LeaderAuth")
const verifyToken=require('../middleware/AdminAuth')
router.post("/add",verifyToken,LeaderController.CreateAleader);
router.get("/allLeaders",verifyToken,LeaderController.getAllLeaders);
router.get("/leader/:id",verifyToken,LeaderController.getLeaderById)
router.put("/leader/:id",verifyToken,LeaderController.updateLeaderInfo)
router.get("/leader/complaints/:id",verifyToken,LeaderController.getLeaderComplaints)
router.post("/refreshtoken",leaderAuth.handleRefreshToken)
router.post("/request-reset-password",leaderAuth.RequestResetPassword)
router.post("/leader/reset-password/:token",leaderAuth.ResetPassword)
router.post("/login",leaderAuth.LeaderLogin)
router.post("/logout",leaderAuth.logout)

module.exports=router
