const mongoose=require("mongoose")


const adminSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
   
    role:{
        type:String,
        default:"admin"
    },
    otp:{
        type:String
    },
    isVerified:{
        type:Boolean,
        required:false
    },
    resetToken:{
        type:String,
    }
    ,resetTokenExpiry:{
        type:Date
    }
    
})

module.exports=mongoose.model("Admin",adminSchema)