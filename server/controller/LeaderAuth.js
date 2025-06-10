const express=require("express")
const nodemailer=require("nodemailer")
const jwt=require("jsonwebtoken")
const leaderModel=require("../model/leader")
const {v4:uuidv4}=require("uuid")
const crypto=require("crypto")
const sendLinkMail=require("../utils/resetPasswordMail")

async function RequestResetPassword(req,res){
    try{
        const {email}=req.body
        if(!email){
            return res.status(404).json({message:"Please enter email"})
        }

        const leader=await leaderModel.findOne({leaderEmail:email})
        if(!leader){
            return res.status(404).json({message:"No Leader with this email"})
        }
        const token=crypto.randomBytes(32).toString("hex")
        const expiry=Date.now()+3600000
        const hashedToken=crypto.createHash("sha256").update(token).digest("hex")
        const resetLink=`http://localhost:${process.env.PORT}/api/leader/reset-password/${token}`

        await sendLinkMail(email,resetLink)
        leader.save()

        return res.status(200).json({message:"Reset Link sent succesffuly"})

    }catch(error){
        console.log(error)
        return res.status(500).json({message:"Internal server error"})
    }
}

async function ResetPassword(req,res){
    try{
        const {token}=req.params
        const {newPassword}=req.body

        if(!newPassword){
            return res.status(404).json({message:"No new Password please provide it"})
        }

        const hashedToken=crypto.createHash("sha256").update(token).digest("hex")

        const leader=await leaderModel.findOne({
            resetToken:hashedToken,
            resetTokenExpiry:{$gt:Date.now()}
        })

        if(!leader){
            return res.status(400).json({message:"Invalid or expired token"})

        }
        const hashed=await bcrypt.hash(newPassword,10)
        leader.password=hashed
        leader.resetToken=null
        leader.resetTokenExpiry=null

        await leader.save();
        return res.status(200).json({message:"Password reset successfully"})


    }catch(error){
        console.log(error)
        return res.status(500).json({message:"Internal Server Error"})
    }
}

async function LeaderLogin(req,res){
    try{
        const {email,password}=req.body
        if(!email || !password){
            return res.status(400).json({message:"Please fill all required fields"})
        }

        const leader=await leaderModel.findOne({
            leaderEmail:email
        })

        if(!leader){
            return res.status(404).json({message:"No leader with this email found"})

        }

        const isMatch=await bcrypt.compare(password,leader.password)
        const token=jwt.sign(
            {id:leader.id,email:leader.leaderEmail,role:leader.leaderRole},process.env.JWT_SECRET,{expiresIn:"1h"}
        )

        const refreshToken=jwt.sign(
            {id:leader.id,email:leader.leaderEmail,role:leader.leaderRole},process.env.JWT_REFRESH_SECRET,{expiresIn:"7d"}
        )


        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure:"production",
            sameSite:"Strict",
            maxAge:7*24*60*1000
        })

        return res.status(200).json({
            message:"Login successfull",token,
            refreshToken
        })



    }catch(error){
        console.log(error)
        return res.status(500).json({message:"Internal Server error"})
    }

}

async function logout(req, res) {
  try {
    res.clearCookie("refreshToken",{
      httpOnly:true,
      secure:"production",
      sameSite:"Strict"
    })
    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleRefreshToken(req, res) {
  const refreshToken=req.cookies.refreshToken;
  if(!refreshToken){
    return res.status(401).json({message:"No refresh token provided"})
  }

  try {
    const user = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ newAccessToken });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Invalid refresh token" });
  }
}


module.exports={
    RequestResetPassword,
    ResetPassword,
    handleRefreshToken,
    logout,
    LeaderLogin
}

