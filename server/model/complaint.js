const { response } = require("express")
const mongoose=require("mongoose")
const complaintSchema=new mongoose.Schema({
 complaint:{
    type:String,
    required:true,
 },
 complaintType:{
    type:String,
    required:true,
 },
 citizenCountryId:{
    type:String,
    required:true,
 },
 citizenProvince:{
    type:String,
    required:true,
 },
 
 citizenDistrict:{
    type:String,
    required:true,
 },
 
 citizenProvince:{
    type:String,
    required:true,
 },
 citizenSector:{
    type:String
 },
 
 citizenCell:{
    type:String,
    required:true,
 },
 
 
 citizenVillage:{
    type:String,
    required:true,
 },
 citizenEmail:{
    type:String
 },
 citizenPhone:{
    type:String
 },
 trackingCode:{
    type:String
 },
 status:{
    type:String,
    default:"Pending",
    enum:["Pending","In Progress","Resolved","Rejected"]
 }
 ,
 response:{
   type:String,
 },
 adminResponder:{
   type:String
 },
 responseDate:{
   type:Date,
  
 },
 postingDate:{
   type:Date,
   default:Date.now
 }

})

module.exports=mongoose.model("Complaint",complaintSchema)