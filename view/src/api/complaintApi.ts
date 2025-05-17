export async function createComplaint(
  complaint: {
    complaint: string;
    citizenProvince: string;
    citizenDistrict: string;
    citizenSector:string;
    citizenCell: string;
    citizenVillage: string;
    citizenEmail:string;
    citizenPhone:string;
    complaintType: string;
   
  },
) {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/complaints/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(complaint),
  });

  if (!response.ok) {
    throw new Error("Failed to send complaint");
  }
  console.log("Complaint sent successfully");

  return response.json();
}