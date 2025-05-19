interface Complaint {
  _id: string;
  trackingCode: string;
  status: string;
  complaint: string;
  complaintType: string;
  citizenCountryId: string;
  citizenProvince: string;
  citizenDistrict: string;
  citizenSector: string;
  citizenCell: string;
  citizenVillage: string;
  citizenEmail?: string;
  citizenPhone?: string;
  response?: string;
  adminResponder?: string;
  responseDate?: string;
  postingDate: string;
}

interface Feedback {
  _id: string;
  message: string;
  rating: number;
  createdAt: string;
}

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const getAllComplaints = async (): Promise<Complaint[]> => {
  try {
    const response = await fetch(`${API_URL}/api/complaints/all`, {
      headers: getAuthHeader()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch complaints');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching complaints:', error);
    throw error;
  }
};

export const updateComplaintStatus = async (id: string, status: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/complaints/update/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error('Failed to update complaint status');
    }
  } catch (error) {
    console.error('Error updating complaint status:', error);
    throw error;
  }
};

export const updateComplaintResponse = async (id: string, responseText: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/complaints/update/response/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ response: responseText })
    });

    if (!response.ok) {
      throw new Error('Failed to update complaint response');
    }
  } catch (error) {
    console.error('Error updating complaint response:', error);
    throw error;
  }
};

export const getAllFeedback = async (): Promise<Feedback[]> => {
  try {
    const response = await fetch(`${API_URL}/api/feedback/all`, {
      headers: getAuthHeader()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch feedback');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    throw error;
  }
}; 