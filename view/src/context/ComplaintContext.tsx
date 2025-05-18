
import React, { createContext, useState, useContext } from "react";

// Types for our complaints
export interface Complaint {
  id: string;
  fullName: string;
  nationalIdOrEmail: string;
  phoneNumber: string;
  district: string;
  sector: string;
  cell:string;
  village:string;
  serviceType: string;
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


export const ComplaintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>();

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
