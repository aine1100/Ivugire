const jwt=require("jsonwebtoken")

async function adminAuth(req,res,next){
    const authHeader=req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(401).json({message:"Unauthorized"})
    }

    const token=authHeader.split(" ")[1]
    try{
        const decoded=jwt.verify(token, process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({message:"Unauthorized"})
        }
        if(decoded.role!=="admin"){
            return res.status(403).json({message:"Forbidden"})
        }
        req.admin=decoded
        next()
    }
        catch(err){
            console.log(err)
            res.status(401).json({message:"Unauthorized"})
        }
}
module.exports=adminAuth