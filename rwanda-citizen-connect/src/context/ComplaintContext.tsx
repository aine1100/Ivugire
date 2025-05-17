
import React, { createContext, useState, useContext } from "react";

// Types for our complaints
export interface Complaint {
  id: string;
  fullName: string;
  nationalIdOrEmail: string;
  phoneNumber: string;
  district: string;
  sector: string;
  serviceType: string;
  category: string;
  description: string;
  status: "Submitted" | "Under Review" | "In Progress" | "Resolved" | "Rejected";
  createdAt: string;
  attachmentUrl?: string;
  response?: string;
}

interface ComplaintContextType {
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, "id" | "status" | "createdAt">) => string;
  getComplaint: (id: string) => Complaint | undefined;
  updateComplaintStatus: (id: string, status: Complaint["status"], response?: string) => void;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

// Mock data for initial complaints
const initialComplaints: Complaint[] = [
  {
    id: "CES-2023-001",
    fullName: "Uwimana Jean",
    nationalIdOrEmail: "1198780012345678",
    phoneNumber: "0789123456",
    district: "Kicukiro",
    sector: "Niboye",
    serviceType: "Water Supply",
    category: "Service Interruption",
    description: "No water supply in our area for the past 3 days.",
    status: "In Progress",
    createdAt: "2023-05-10T09:00:00Z",
  },
  {
    id: "CES-2023-002",
    fullName: "Mutesi Alice",
    nationalIdOrEmail: "alice.mutesi@gmail.com",
    phoneNumber: "0788234567",
    district: "Gasabo",
    sector: "Remera",
    serviceType: "Electricity",
    category: "Billing Issue",
    description: "I was charged for electricity I did not use.",
    status: "Submitted",
    createdAt: "2023-05-12T14:30:00Z",
  },
  {
    id: "CES-2023-003",
    fullName: "Hakizimana Eric",
    nationalIdOrEmail: "eric.hakizimana@yahoo.com",
    phoneNumber: "0738345678",
    district: "Nyarugenge",
    sector: "Nyarugenge",
    serviceType: "Roads",
    category: "Maintenance Request",
    description: "Large potholes on the main road near the market.",
    status: "Resolved",
    createdAt: "2023-05-01T10:15:00Z",
    response: "The road maintenance team has filled the potholes. Thank you for reporting this issue."
  }
];

export const ComplaintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);

  const addComplaint = (newComplaint: Omit<Complaint, "id" | "status" | "createdAt">): string => {
    const id = `CES-${new Date().getFullYear()}-${String(complaints.length + 1).padStart(3, '0')}`;
    const complaintWithId = {
      ...newComplaint,
      id,
      status: "Submitted",
      createdAt: new Date().toISOString(),
    };
    
    setComplaints([...complaints, complaintWithId as Complaint]);
    return id;
  };

  const getComplaint = (id: string): Complaint | undefined => {
    return complaints.find(complaint => complaint.id === id);
  };

  const updateComplaintStatus = (id: string, status: Complaint["status"], response?: string): void => {
    setComplaints(complaints.map(complaint => 
      complaint.id === id ? { ...complaint, status, response } : complaint
    ));
  };

  return (
    <ComplaintContext.Provider value={{ complaints, addComplaint, getComplaint, updateComplaintStatus }}>
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (context === undefined) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};
