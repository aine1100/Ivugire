const AdminModel = require("../model/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validateMail } = require("../utils/format");
const sendOtpMail = require("../utils/otpMail");
const crypto=require("crypto")
const sendLinkMail=require("../utils/resetPasswordMail");
const admin = require("../model/admin");
const { ref } = require("process");

async function registerAdmin(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    validateMail(email, res);

    const existingAdmin = await AdminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newAdmin = new AdminModel({
      name,
      email,
      password: hashedPassword,
      otp: otpCode,
      isVerified: false,
    });

    await newAdmin.save();

    // Send OTP email
    await sendOtpMail(email, otpCode);

    return res.status(201).json({
      message: "Admin created successfully. Check your email for the OTP code."
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken",refreshToken,{
      httpOnly:true,
      secure:"production",
      sameSite:"Strict",
      maxAge:7*24*60*1000
    })

    return res.status(200).json({
      message: "Login successful",
      token,
      refreshToken,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
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



async function verifyUserOtp(req, res) {
  const { email, otp } = req.body;

  const admin = await AdminModel.findOne({ email });
  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  if (admin.otp === otp) {
    admin.isVerified = true;
    admin.otp = null;
    await admin.save();
    return res.status(200).json({ message: "OTP verified successfully" });
  } else {
    return res.status(400).json({ message: "Invalid OTP" });
  }
}

async function RequestResetPassword(req,res){
  try{
    const {email}=req.body
  
    if(!email){
      return res.status(404).json({message:"Please enter in the email"})
    }

    const user=await AdminModel.findOne({email:email})
    if(!user){
      return res.status(404).json({message:"No user found with this email"})
    }
    const token=crypto.randomBytes(32).toString("hex")
    const expiry=Date.now()+3600000
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    user.resetToken=hashedToken
    user.resetTokenExpiry=expiry

    const resetLink=`http://localhost:${process.env.PORT}/api/auth/admin/reset-password/${token}`

    await sendLinkMail(email,resetLink)
    user.save()

    return res.status(200).json({message:"Reset Link sent successfully"})




  }catch(error){
    console.log(error)
    return res.status(500).json({message:"Internal server error"})
  }
}
async function ResetPassword(req, res) {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const admin = await AdminModel.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    admin.password = hashed;
    admin.resetToken = null;
    admin.resetTokenExpiry = null;

    await admin.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


module.exports = {
  registerAdmin,
  loginAdmin,
  logout,
  handleRefreshToken,
  verifyUserOtp,
  RequestResetPassword,
  ResetPassword

};
