export async function postFeedback(
  feedback: {
    feedback: string;
    citizenProvince: string;
    citizenDistrict: string;
    citizenSector:string;
    citizenCell: string;
    citizenVillage: string;
    citizenEmail:string;
    citizenPhone:string;
  },
 
) {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/feedback/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(feedback),
  });

  if (!response.ok) {
    throw new Error("Failed to send feedback");
  }
  console.log("Feedback sent successfully");

  return response.json();
}


export async function getAllFeedBacks() {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/feedback/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch feedbacks");
  }

  return response.json();
}

export async function getFeedBackById(_id: string) {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/feedback/${_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch feedback");
  }

  return response.json();
}