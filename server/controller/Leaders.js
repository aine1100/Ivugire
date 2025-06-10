const express=require("express")
const leaderModel=require("../model/leader")
const validateMail=require("../utils/format")
const complaintModel=require("../model/complaint")
const sendMail=require("../utils/sendMail")

 async function CreateAleader(req,res){
   try{
     const {name,email,phone,role}=req.body

    if(!name|| !email || !phone|| !role ){
       return res.status(400).json({message:"please fill all the fields"})
    }

    validateMail.validatePhoneAndMail(email,phone,res)


    const newLeader=new leaderModel({
        leaderName:name,
        leaderEmail:email,
        leaderPhoneAddress:phone,
        leaderRole:role,

    })

    await newLeader.save();

    return res.status(200).json({message:"Leader Created successfully"})
    console.log(newLeader)

   }
   catch(error){
    console.log(error)
    return res.status(500).json({message:"Internal server error"})
   }
}


 async function getAllLeaders(req,res){
    try{
        const leaders=await leaderModel.find().limit(10)
        const paginatedLeaders=await leaders;
        console.log(leaders)
        return res.status(200).json({paginatedLeaders})

    }catch(error){
        console.log(error)
        return res.status(500).json({message:"Internal server error"})
    }
}

 async function getLeaderById(req,res){
    try{
        const {id}=req.params
        if(!id){
            return res.status(400).json({message:"please enter the id"})
        }

        const leader=await leaderModel.findById(id);
        if(!leader){
            
            return res.status(400).json({message:"No leader found with this id"})
        }
        return res.status(200).json({leader})

        

    }catch(error){
        return res.status(500).json({message:"Internal server error"})
    }
}

async function updateLeaderInfo(req,res){
    try{
        const {id}=req.params
        if(!id){
            return res.status(400).json({message:"please enter the id"})
        }
        const leader=await leaderModel.findById(id)
         if(!leader){
            
            return res.status(400).json({message:"No leader found with this id"})
        }

        if(leader.leaderRole=="Governor"){
            const {province}=req.body
            const newLeader=await leaderModel.findOneAndUpdate({leaderProvince:province},{$set:req.body},{new:true}) 
            sendMail(leader.leaderEmail,leader)
            
            console.log(leader)
        }

        if(leader.leaderRole=="Mayor"){
            const {province,district}=req.body
            const newLeader=await leaderModel.findOneAndUpdate({leaderProvince:province,leaderDistrict:district},{$set:req.body},{new:true})
            sendMail(leader.leaderEmail,leader)
            console.log(leader)
        }

        if(leader.leaderRole="SectorLeader"){
            const {province,district,sector}=req.body
            const updateLeader=await leaderModel.findByIdAndUpdate({leaderProvince:province,leaderDistrict:district,leaderSector:sector},{$set:req.body},{new:true})
            sendMail(leader.leaderEmail,leader)
            console.log(leader)

        }

        if(leader.leaderRole="CellLeader"){
            const {province,district,sector,cell}=req.body
            const updateLeader=await leaderModel.findByIdAndUpdate({leaderProvince:province,leaderDistrict:district,leaderSector:sector,leaderCell:cell},{$set:req.body},{new:true})
            sendMail(leader.leaderEmail,leader)
            console.log(leader)

        }

        if(leader.leaderRole="Village"){
            const {province,district,sector,cell,village}=req.body
            const updateLeader=await leaderModel.findByIdAndUpdate({leaderProvince:province,leaderDistrict:district,leaderSector:sector,leaderCell:cell,leaderVillage:village},{$set:req.body},{new:true})
           sendMail(leader.leaderEmail,leader)
            console.log(leader)
        }


        return res.status(200).json({leader})


    }
    catch(error){
        console.log(error)
        return res.status(500).json({message:"Internal Server error"})
    }
}

async function getLeaderComplaints(req,res){
    try{
         const {id}=req.params
        if(!id){
            return res.status(400).json({message:"please enter the id"})
        }

        const leader=await leaderModel.findById(id)
        if(!leader){
           return res.status(404).json({message:"No leader with this id found"})
        }

        if(leader.leaderRole=="Governor"){
            const complaints=await complaintModel.find({citizenProvince:leader.leaderProvince})
            console.log(complaints)
            return res.status(200).json({complaints})
        }
        if(leader.leaderRole=="Mayor"){
            const complaints=await complaintModel.find({citizenDistrict:leader.leaderDistrict})
            console.log(complaints)
            return res.status(200).json({complaints})
            
        }
        if(leader.leaderRole=="SectorLeader"){
            const complaints=await complaintModel.find({citizenSector:leader.leaderSector})
            console.log(complaints)
            return res.status(200).json({complaints})
            
        }
        if(leader.leaderRole=="CellLeader"){
            const complaints=await complaintModel.find({citizenCell:leader.leaderCell})
            console.log(complaints)
            return res.status(200).json({complaints})
            
        }
        if(leader.leaderRole=="VillageLeader"){
            const complaints=await complaintModel.find({citizenVillage:leader.leaderVillage})
            console.log(complaints)
            return res.status(200).json({complaints})
            
        }

        return res.status(201).json({message:"Complaints found"})
        return res.status(200).json({leader})

    
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message:"Internal server error"})
    }

}

module.exports={
    CreateAleader,
    getAllLeaders,
    getLeaderById,
    getLeaderComplaints,
    updateLeaderInfo
}