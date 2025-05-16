const mongoose=require("mongoose")
const feedBackSchema= new mongoose.Schema({
    feedback:{
        type:String,
        required:true
    },
    
    citizenProvince:{
        type:String,
        required:true
    },
    citizenDistrict:{
        type:String,
        required:true
    },
    citizenSector:{
        type:String
    },
    citizenCell:{
        type:String,
        required:true
    },
    citizenVillage:{
        type:String,
        required:true
    },
    citizenEmail:{
        type:String
    },
    citizenPhone:{
        type:String
    }
})

module.exports=mongoose.model("FeedBack",feedBackSchema)