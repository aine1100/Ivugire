const express = require('express');
const {validateMail}=require("../utils/format")
const AdminModel=require("../model/admin")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const { v4: uuidv4 } = require('uuid');
const nodemailer=require("nodemailer")


async function registerAdmin(req,res){
    try{
        const {name, email, password}=req.body
        if(!name || !email || !password){
            return res.status(400).json({message:"Please fill in all required fields"})
        }
        validateMail(email, res)
        const hashedPassword=await bcrypt.hash(password, 10)
        const newAdmin=new AdminModel({
            name,
            email,
            password:hashedPassword
        })
        await newAdmin.save()
        res.status(201).json({
            message:"Admin created successfully"
        })
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal server error"})
    }
}

async function loginAdmin(req,res){
    try{
        const {email, password}=req.body
        if(!email || !password){
            return res.status(400).json({message:"Please fill in all required fields"})
        }
        const admin=await AdminModel.findOne({email})
        if(!admin){
            return res.status(404).json({message:"Admin not found"})
        }
        const isMatch=await bcrypt.compare(password, admin.password)
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"})
        }
        const token=jwt.sign({id:admin._id,email:admin.email,role:admin.role}, process.env.JWT_SECRET, {expiresIn:"1h"})
        res.status(200).json({
            message:"Login successful",
            token
        })
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal server error"})
    }
}


module.exports={
    registerAdmin,
    loginAdmin
}
