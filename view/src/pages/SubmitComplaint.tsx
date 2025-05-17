
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useComplaints } from "@/context/ComplaintContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const districts = [
  "Gasabo", "Kicukiro", "Nyarugenge", "Burera", "Gakenke", "Gicumbi", 
  "Musanze", "Rulindo", "Gisagara", "Huye", "Kamonyi", "Muhanga", 
  "Nyamagabe", "Nyanza", "Nyaruguru", "Ruhango", "Bugesera", "Gatsibo", 
  "Kayonza", "Kirehe", "Ngoma", "Nyagatare", "Rwamagana", "Karongi", 
  "Ngororero", "Nyabihu", "Nyamasheke", "Rubavu", "Rutsiro", "Rusizi"
];

const sectors = {
  Gasabo: ["Bumbogo", "Gatsata", "Gikomero", "Gisozi", "Jabana", "Jali", "Kacyiru", "Kimihurura", "Kimironko", "Kinyinya", "Ndera", "Nduba", "Remera", "Rusororo", "Rutunga"],
  Kicukiro: ["Gahanga", "Gatenga", "Gikondo", "Kagarama", "Kanombe", "Kicukiro", "Kigarama", "Masaka", "Niboye", "Nyarugunga"],
  Nyarugenge: ["Gitega", "Kanyinya", "Kigali", "Kimisagara", "Mageragere", "Muhima", "Nyakabanda", "Nyamirambo", "Nyarugenge", "Rwezamenyo"],
};

const serviceTypes = [
  "Water Supply", "Electricity", "Roads", "Healthcare", "Education",
  "Sanitation", "Public Transport", "Security", "Land Services", "Other"
];

const complaintCategories = {
  "Water Supply": ["Service Interruption", "Quality Issues", "Billing Problems", "Connection Problems", "Other"],
  "Electricity": ["Power Outage", "Voltage Issues", "Billing Issues", "Connection Problems", "Other"],
  "Roads": ["Potholes", "Traffic Signals", "Road Signs", "Construction Issues", "Other"],
  "Healthcare": ["Service Quality", "Medication Issues", "Staff Behavior", "Facilities", "Other"],
  "Education": ["School Facilities", "Teacher Issues", "Curriculum", "Administration", "Other"],
  "Sanitation": ["Waste Collection", "Public Toilets", "Drainage", "Cleanliness", "Other"],
  "Public Transport": ["Service Frequency", "Driver Behavior", "Vehicle Condition", "Routes", "Other"],
  "Security": ["Police Response", "Crime Reporting", "Safety Concerns", "Patrols", "Other"],
  "Land Services": ["Registration", "Surveying", "Documentation", "Disputes", "Other"],
  "Other": ["General Complaint", "Suggestion", "Inquiry", "Feedback"],
};

const SubmitComplaint = () => {
  const { addComplaint } = useComplaints();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    nationalIdOrEmail: "",
    phoneNumber: "",
    district: "",
    sector: "",
    serviceType: "",
    category: "",
    description: "",
    attachment: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSectors, setAvailableSectors] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  const handleDistrictChange = (value: string) => {
    setFormData({
      ...formData,
      district: value,
      sector: "",
    });
    setAvailableSectors(sectors[value as keyof typeof sectors] || []);
  };

  const handleServiceTypeChange = (value: string) => {
    setFormData({
      ...formData,
      serviceType: value,
      category: "",
    });
    setAvailableCategories(complaintCategories[value as keyof typeof complaintCategories] || []);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData({
        ...formData,
        attachment: files[0],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.fullName || !formData.nationalIdOrEmail || !formData.phoneNumber || 
        !formData.district || !formData.sector || !formData.serviceType || 
        !formData.category || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Submit the complaint
      const trackingId = addComplaint({
        fullName: formData.fullName,
        nationalIdOrEmail: formData.nationalIdOrEmail,
        phoneNumber: formData.phoneNumber,
        district: formData.district,
        sector: formData.sector,
        serviceType: formData.serviceType,
        category: formData.category,
        description: formData.description,
        attachmentUrl: formData.attachment ? URL.createObjectURL(formData.attachment) : undefined,
      });

      toast({
        title: "Complaint Submitted",
        description: `Your complaint has been successfully submitted. Your tracking ID is ${trackingId}`,
      });

      // Navigate to success page or redirect
      setTimeout(() => {
        navigate(`/track?id=${trackingId}`);
      }, 1500);
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "An error occurred while submitting your complaint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Submit a Complaint</CardTitle>
          <CardDescription>
            Fill in the form below to submit your complaint or feedback about a public service in Rwanda.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationalIdOrEmail">National ID or Email</Label>
                <Input
                  id="nationalIdOrEmail"
                  name="nationalIdOrEmail"
                  placeholder="Enter your National ID or Email"
                  value={formData.nationalIdOrEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Select
                  value={formData.district}
                  onValueChange={(value) => handleDistrictChange(value)}
                >
                  <SelectTrigger id="district">
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector">Sector</Label>
                <Select
                  value={formData.sector}
                  onValueChange={(value) => handleSelectChange("sector", value)}
                  disabled={!formData.district}
                >
                  <SelectTrigger id="sector">
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceType">Type of Service</Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) => handleServiceTypeChange(value)}
                >
                  <SelectTrigger id="serviceType">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Complaint Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                  disabled={!formData.serviceType}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Please describe your complaint in detail"
                rows={5}
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>


          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate("/")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-rwanda-blue hover:bg-rwanda-blue/90">
              {isSubmitting ? "Submitting..." : "Submit Complaint"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SubmitComplaint;
