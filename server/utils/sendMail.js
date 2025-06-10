const express=require("express")
const nodemailer=require("nodemailer")

async function sendMail(email,leader){
     const transporter=nodemailer.createTransport({
                    service:"gmail",
                    auth:{
                        user:process.env.EMAIL,
                        pass:process.env.PASSWORD
                    }
                })
                await transporter.sendMail({
                    from:`"Citizen Help Desk"<${process.env.EMAIL}>`,
                    to:email,
                    subject:"Your Profile is updated",
                    html:`<p>Your have found new roles .</p>`
                })
    
                transporter.verify((error,success)=>{
                    if(error){
                        console.log(error)
                    }else{
                        console.log("Email sent successfully")
                    }
                })

              
    

}

module.exports=sendMail