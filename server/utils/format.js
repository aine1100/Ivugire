function validateCitizenInfo(citizenEmail, citizenPhone, citizenCountryId, res) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(?:\+250|0)(72|73|78|79)\d{7}$/;
  const nationalIdRegex = /^[12][0-9]{15}$/;

  if (!emailRegex.test(citizenEmail)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  if (!phoneRegex.test(citizenPhone)) {
    return res.status(400).json({ message: "Invalid Rwandan phone number. Use format 07XXXXXXXX or +2507XXXXXXXX" });
  }

  if (!nationalIdRegex.test(citizenCountryId)) {
    return res.status(400).json({ message: "Invalid Rwandan national ID. Must be 16 digits starting with 1 or 2." });
  }

  return null; // All valid
}
function validatePhoneAndMail(citizenEmail, citizenPhone,  res) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(?:\+250|0)(72|73|78|79)\d{7}$/;
  const nationalIdRegex = /^[12][0-9]{15}$/;

  if (!emailRegex.test(citizenEmail)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  if (!phoneRegex.test(citizenPhone)) {
    return res.status(400).json({ message: "Invalid Rwandan phone number. Use format 07XXXXXXXX or +2507XXXXXXXX" });
  }

 

  return null; // All valid
}
function validateMail(citizenEmail,  res) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(?:\+250|0)(72|73|78|79)\d{7}$/;
  const nationalIdRegex = /^[12][0-9]{15}$/;

  if (!emailRegex.test(citizenEmail)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  

 

  return null; // All valid
}



module.exports={
    validateCitizenInfo,
    validatePhoneAndMail,
    validateMail
};