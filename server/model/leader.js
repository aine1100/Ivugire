const mongoose=require("mongoose")
const leaderSchema=new mongoose.Schema({
    leaderName:{
        type:String,
        required:true
    },
    leaderPhoneAddress:{
        type:String,
        required:true
    },
    leaderEmail:{
        type:String,
        required:true
    },
    leaderRole:{
        type:String,
        enum:["Minister","Governor","Mayor","SectorLeader","VillageLeader","CellLeader"]
    },
    leaderProvince:{
        type:String
    },
    leaderDistrict:{
        type:String
    },
    leaderSector:{
        type:String
    },
    leaderCell:{
        type:String
    },
    leaderVillage:{
        type:String
    },
    resetToken:{
        type:String
    },
    resetTokenExpiry:{
        type:Date

    },
    password:{
        type:String
    }
    

   
})

module.exports=mongoose.model("leaders",leaderSchema)