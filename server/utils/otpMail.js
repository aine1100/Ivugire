const nodemailer = require("nodemailer");

async function sendOtpMail(email, otpCode) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP Code",
    html: `<p>Your OTP code is <b>${otpCode}</b>. It is valid for 10 minutes.</p>`,
  });
}

module.exports = sendOtpMail;
