const complaintModel=require("../model/complaint")
const {v4:uuidv4}=require("uuid")
const nodemailer=require("nodemailer")
const {validateCitizenInfo}=require("../utils/format")

async function createComplaint(req,res){
    try{
        const {complaint, complaintType, citizenCountryId, citizenProvince, citizenDistrict, citizenSector, citizenCell, citizenVillage, citizenEmail, citizenPhone}=req.body
        const trackingCode=uuidv4().split("-")[0]
        if(!complaint || !complaintType || !citizenCountryId || !citizenProvince || !citizenDistrict || !citizenCell || !citizenVillage){
            return res.status(400).json({message:"Please fill in all required fields"})
        }
        validateCitizenInfo(citizenEmail, citizenPhone, citizenCountryId, res)

        const citizenComplaint= new complaintModel({
            complaint,
            complaintType,
            citizenCountryId,
            citizenProvince,
            citizenDistrict,
            citizenSector,
            citizenCell,
            citizenVillage,
            citizenEmail,
            citizenPhone,
            trackingCode
        })
        await citizenComplaint.save()

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
                subject:"Complaint Tracking Code",
                text:`Your complaint has been received. Your tracking code is ${trackingCode}.`
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
            message:"Complaint created successfully",
            trackingCode
        })
        res.status(200).json({
            message: "Complaint response updated successfully",
            updateComplaint
        })
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal server error"})
    }


}

async function getAllComplaints(req,res){
    try{
        const complaints=await complaintModel.find()
        res.status(200).json(complaints)


    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal server error"})
    }
}

async function getComplaintbyTrackingId(req,res){
    try{
        const {trackingCode}=req.params
        const complaint=await complaintModel.findOne({
            trackingCode
        })
        if(!complaint){
            return res.status(404).json({message:"Complaint not found"})
        }
        res.status(200).json(complaint)
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"Internal server error"})
    }
}

async function updateComplaintStatus(req,res){
    try{
        const {id}=req.params
        const {status}=req.body

        const updateComplaint=await complaintModel.findByIdAndUpdate(id,{
            status
        },{
            new:true
        })

        // Send email notification if user provided email
        if(updateComplaint.citizenEmail){
            const transporter=nodemailer.createTransport({
                service:"gmail",
                auth:{
                    user:process.env.EMAIL,
                    pass:process.env.PASSWORD
                }
            })

            const emailContent = `
                Dear Citizen,
                
                Your complaint (Tracking Code: ${updateComplaint.trackingCode}) has been updated.
                
                New Status: ${status}
                
                You can track your complaint using your tracking code.
                
                Best regards,
                Citizen Help Desk Team
            `

            await transporter.sendMail({
                from:`"Citizen Help Desk"<${process.env.EMAIL}>`,
                to:updateComplaint.citizenEmail,
                subject:"Complaint Status Update",
                text:emailContent
            })

            transporter.verify((error,success)=>{
                if(error){
                    console.log("Email sending error:", error)
                }else{
                    console.log("Status update email sent successfully")
                }
            })
        }

        res.status(200).json({
            message:"Complaint status updated successfully",
            updateComplaint
        })

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal server error"})
    }
}

async function updateComplaintResponse(req,res){
    try{
        const {_id}=req.params
        const {response, adminResponder}=req.body
        
        const updateComplaint=await complaintModel.findByIdAndUpdate(_id,{
            response,
            adminResponder
        },{
            new:true
        })

        // Send email notification if user provided email
        if(updateComplaint.citizenEmail){
            const transporter=nodemailer.createTransport({
                service:"gmail",
                auth:{
                    user:process.env.EMAIL,
                    pass:process.env.PASSWORD
                }
            })

            const emailContent = `
                Dear Citizen,
                
                Your complaint (Tracking Code: ${updateComplaint.trackingCode}) has received a response.
                
                Response from ${adminResponder}:
                ${response}
                
                You can track your complaint using your tracking code.
                
                Best regards,
                Citizen Help Desk Team
            `

            await transporter.sendMail({
                from:`"Citizen Help Desk"<${process.env.EMAIL}>`,
                to:updateComplaint.citizenEmail,
                subject:"Complaint Response Update",
                text:emailContent
            })

            transporter.verify((error,success)=>{
                if(error){
                    console.log("Email sending error:", error)
                }else{
                    console.log("Response update email sent successfully")
                }
            })
        }

        res.status(200).json({
            message:"Complaint response updated successfully",
            updateComplaint
        })

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal server error"})
    }
}

module.exports={
    createComplaint,
    getAllComplaints,
    getComplaintbyTrackingId,
    updateComplaintStatus,
    updateComplaintResponse
}   