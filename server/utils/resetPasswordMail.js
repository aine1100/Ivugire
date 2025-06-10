const nodemailer=require("nodemailer")

async function sendResetMail(email,link){
    try{
        const transporter=await nodemailer.createTransport({
           service:"gmail",
           auth:{
            user:process.env.EMAIL,
            pass:process.env.PASSWORD
           }

        })

        await transporter.sendMail({
            from:process.env.EMAIL,
            to:email,
            subject:"Reset Password Token",
            html:`<p>This is your new link to reset your password ${link}</p>`
        })

        await transporter.verify((error,success)=>{
            if(error){
                console.log(error)
            }
            console.log("Email sent successfully")
        })

    }catch(error){

        console.log(error)

    }
}

module.exports=sendResetMail