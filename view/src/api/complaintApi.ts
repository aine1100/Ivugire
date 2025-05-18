export async function createComplaint(
  complaint: {
    complaint: string;
    complaintType: string;
    citizenCountryId: string;
    citizenProvince: string;
    citizenDistrict: string;
    citizenSector: string;
    citizenCell: string;
    citizenVillage: string;
    citizenEmail: string;
    citizenPhone: string;
  },
) {
  try {
    console.log('API URL:', `${import.meta.env.VITE_BACKEND_URL}/api/complaints/submit`);
    console.log('Request payload:', complaint);

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/complaints/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(complaint),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });
      throw new Error(errorData?.message || `Failed to send complaint: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Complaint sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in createComplaint:", error);
    throw error;
  }
}