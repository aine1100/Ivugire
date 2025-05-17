const express=require("express")
const nodemailer=require("nodemailer")
const {validateMail}=require("../utils/format")
const feedbackModel=require("../model/feedback")

async function createFeedBack(req,res){
    try{
        const {feedback, citizenProvince, citizenDistrict, citizenSector, citizenCell, citizenVillage, citizenEmail, citizenPhone}=req.body
       if(!feedback || !citizenProvince || !citizenDistrict || !citizenCell || !citizenVillage){
            return res.status(400).json({message:"Please fill in all required fields"})
        }
        validateMail(citizenEmail, citizenPhone, res)

        const citizenFeedBack= new feedbackModel({
            feedback,
            citizenProvince,
            citizenDistrict,
            citizenSector,
            citizenCell,
            citizenVillage,
            citizenEmail,
            citizenPhone
        })
        await citizenFeedBack.save()

        if(citizenEmail){
            const transporter=nodemailer.createTransport({
                service:"gmail",
                auth:{
                    user:process.env.EMAIL,
                    pass:process.env.PASSWORD
                }
            })
            await transporter.sendMail({
                from:`"Citizen Help Desk"<${process.env.EMAIL}>`,
                to:citizenEmail,
                subject:"FeedBack Sending",
                text:`Your Feedback has been received .`
            })

            transporter.verify((error,success)=>{
                if(error){
                    console.log(error)
                }else{
                    console.log("Email sent successfully")
                }
            })
        }
        res.status(201).json({
            message:"FeedBack created successfully",
           
            
        })

        

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal server error"})
    }


}

async function getAllFeedBack(req,res){
    try{
        const feedbacks=await feedbackModel.find()
        res.status(200).json(feedbacks)


    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal server error"})
    }
}

async function getFeedBackById(req,res){
    try{
        const {_id}=req.params
        const feedback=await feedbackModel.findOne({
            _id
        })
        if(!feedback){
            return res.status(404).json({message:"Feedback not found"})
        }
        res.status(200).json(feedback)
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"Internal server error"})
    }
}


module.exports={
   createFeedBack,
   getAllFeedBack,
   getFeedBackById
}