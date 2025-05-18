import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { createComplaint } from "@/api/complaintApi";

const API_BASE_URL = import.meta.env.VITE_LOCATIONS_URL;

interface Location {
  id: string;
  name: string;
}

interface ApiResponse {
  status: string;
  provinces?: string[];
  districts?: string[];
  sectors?: string[];
  cells?: string[];
  villages?: string[];
}

const complaintCategories = {
  "Water Supply": [
    "Service Interruption",
    "Quality Issues",
    "Billing Problems",
    "Connection Problems",
    "Other",
  ],
  Electricity: [
    "Power Outage",
    "Voltage Issues",
    "Billing Issues",
    "Connection Problems",
    "Other",
  ],
  Roads: [
    "Potholes",
    "Traffic Signals",
    "Road Signs",
    "Construction Issues",
    "Other",
  ],
  Healthcare: [
    "Service Quality",
    "Medication Issues",
    "Staff Behavior",
    "Facilities",
    "Other",
  ],
  Education: [
    "School Facilities",
    "Teacher Issues",
    "Curriculum",
    "Administration",
    "Other",
  ],
  Sanitation: [
    "Waste Collection",
    "Public Toilets",
    "Drainage",
    "Cleanliness",
    "Other",
  ],
  "Public Transport": [
    "Service Frequency",
    "Driver Behavior",
    "Vehicle Condition",
    "Routes",
    "Other",
  ],
  Security: [
    "Police Response",
    "Crime Reporting",
    "Safety Concerns",
    "Patrols",
    "Other",
  ],
  "Land Services": [
    "Registration",
    "Surveying",
    "Documentation",
    "Disputes",
    "Other",
  ],
  Other: ["General Complaint", "Suggestion", "Inquiry", "Feedback"],
};

const SubmitComplaint = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    citizenCountryId: "",
    nationalIdOrEmail: "",
    phoneNumber: "",
    province: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
    serviceType: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState({
    provinces: false,
    districts: false,
    sectors: false,
    cells: false,
    villages: false,
  });

  const [locations, setLocations] = useState<{
    provinces: string[];
    districts: string[];
    sectors: string[];
    cells: string[];
    villages: string[];
  }>({
    provinces: [],
    districts: [],
    sectors: [],
    cells: [],
    villages: [],
  });

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoading(prev => ({ ...prev, provinces: true }));
      try {
        const response = await fetch(`${API_BASE_URL}/provinces`);
        if (!response.ok) throw new Error('Failed to fetch provinces');
        const data: ApiResponse = await response.json();
        if (data.status === "success" && data.provinces) {
          setLocations(prev => ({ ...prev, provinces: data.provinces || [] }));
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load provinces. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(prev => ({ ...prev, provinces: false }));
      }
    };

    fetchProvinces();
  }, [toast]);

  // Fetch districts when province changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!formData.province) return;
      
      setIsLoading(prev => ({ ...prev, districts: true }));
      try {
        const encodedProvince = encodeURIComponent(formData.province);
        const response = await fetch(
          `${API_BASE_URL}/province/${encodedProvince}/districts`
        );
        if (!response.ok) throw new Error('Failed to fetch districts');
        const data: ApiResponse = await response.json();
        console.log('Districts response:', data); // Debug log
        if (data.status === "success" && data.districts) {
          setLocations(prev => ({ ...prev, districts: data.districts || [] }));
        }
      } catch (error) {
        console.error('Error fetching districts:', error); // Debug log
        toast({
          title: "Error",
          description: "Failed to load districts. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(prev => ({ ...prev, districts: false }));
      }
    };

    fetchDistricts();
  }, [formData.province, toast]);

  // Fetch sectors when district changes
  useEffect(() => {
    const fetchSectors = async () => {
      if (!formData.province || !formData.district) return;
      
      setIsLoading(prev => ({ ...prev, sectors: true }));
      try {
        const encodedProvince = encodeURIComponent(formData.province);
        const encodedDistrict = encodeURIComponent(formData.district);
        const response = await fetch(
          `${API_BASE_URL}/province/${encodedProvince}/district/${encodedDistrict}/sector`
        );
        if (!response.ok) throw new Error('Failed to fetch sectors');
        const data: ApiResponse = await response.json();
        console.log('Sectors response:', data); // Debug log
        if (data.status === "success" && data.sectors) {
          setLocations(prev => ({ ...prev, sectors: data.sectors || [] }));
        }
      } catch (error) {
        console.error('Error fetching sectors:', error); // Debug log
        toast({
          title: "Error",
          description: "Failed to load sectors. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(prev => ({ ...prev, sectors: false }));
      }
    };

    fetchSectors();
  }, [formData.province, formData.district, toast]);

  // Fetch cells when sector changes
  useEffect(() => {
    const fetchCells = async () => {
      if (!formData.province || !formData.district || !formData.sector) return;
      
      setIsLoading(prev => ({ ...prev, cells: true }));
      try {
        const encodedProvince = encodeURIComponent(formData.province);
        const encodedDistrict = encodeURIComponent(formData.district);
        const encodedSector = encodeURIComponent(formData.sector);
        const response = await fetch(
          `${API_BASE_URL}/province/${encodedProvince}/district/${encodedDistrict}/sector/${encodedSector}/cells`
        );
        if (!response.ok) throw new Error('Failed to fetch cells');
        const data: ApiResponse = await response.json();
        console.log('Cells response:', data); // Debug log
        if (data.status === "success" && data.cells) {
          setLocations(prev => ({ ...prev, cells: data.cells || [] }));
        }
      } catch (error) {
        console.error('Error fetching cells:', error); // Debug log
        toast({
          title: "Error",
          description: "Failed to load cells. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(prev => ({ ...prev, cells: false }));
      }
    };

    fetchCells();
  }, [formData.province, formData.district, formData.sector, toast]);

  // Fetch villages when cell changes
  useEffect(() => {
    const fetchVillages = async () => {
      if (!formData.province || !formData.district || !formData.sector || !formData.cell) return;
      
      setIsLoading(prev => ({ ...prev, villages: true }));
      try {
        const encodedProvince = encodeURIComponent(formData.province);
        const encodedDistrict = encodeURIComponent(formData.district);
        const encodedSector = encodeURIComponent(formData.sector);
        const encodedCell = encodeURIComponent(formData.cell);
        const response = await fetch(
          `${API_BASE_URL}/province/${encodedProvince}/district/${encodedDistrict}/sector/${encodedSector}/cell/${encodedCell}/villages`
        );
        if (!response.ok) throw new Error('Failed to fetch villages');
        const data: ApiResponse = await response.json();
        console.log('Villages response:', data); // Debug log
        if (data.status === "success" && data.villages) {
          setLocations(prev => ({ ...prev, villages: data.villages || [] }));
        }
      } catch (error) {
        console.error('Error fetching villages:', error); // Debug log
        toast({
          title: "Error",
          description: "Failed to load villages. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(prev => ({ ...prev, villages: false }));
      }
    };

    fetchVillages();
  }, [formData.province, formData.district, formData.sector, formData.cell, toast]);

  const handleLocationChange = (type: string, value: string) => {
    const resetFields: Record<string, Record<string, string>> = {
      province: { district: "", sector: "", cell: "", village: "" },
      district: { sector: "", cell: "", village: "" },
      sector: { cell: "", village: "" },
      cell: { village: "" },
    };

    setFormData(prev => ({
      ...prev,
      [type]: value,
      ...(resetFields[type] || {}),
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (
      !formData.fullName ||
      !formData.citizenCountryId ||
      !formData.nationalIdOrEmail ||
      !formData.phoneNumber ||
      !formData.province ||
      !formData.district ||
      !formData.sector ||
      !formData.cell ||
      !formData.village ||
      !formData.serviceType ||
      !formData.description
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare complaint data according to the API structure
      const complaintData = {
        complaint: formData.description,
        complaintType: formData.serviceType,
        citizenCountryId: formData.citizenCountryId,
        citizenProvince: formData.province,
        citizenDistrict: formData.district,
        citizenSector: formData.sector,
        citizenCell: formData.cell,
        citizenVillage: formData.village,
        citizenEmail: formData.nationalIdOrEmail,
        citizenPhone: formData.phoneNumber,
      };

      console.log('Submitting complaint data:', complaintData); // Debug log

      const response = await createComplaint(complaintData);
      console.log('Complaint submission response:', response); // Debug log
      
      toast({
        title: "Complaint Submitted",
        description: "Your complaint has been successfully submitted.",
      });

      // Navigate to success page or tracking page
      setTimeout(() => {
        navigate(`/track?id=${response.id}`);
      }, 1500);
    } catch (error) {
      console.error('Error submitting complaint:', error);
      // Log more detailed error information
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
        });
      }
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
            Fill in the form below to submit your complaint or feedback about a
            public service in Rwanda.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Fields */}
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
                <Label htmlFor="citizenCountryId">National ID</Label>
                <Input
                  id="citizenCountryId"
                  name="citizenCountryId"
                  placeholder="Enter your National ID"
                  value={formData.citizenCountryId}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationalIdOrEmail">Email</Label>
                <Input
                  id="nationalIdOrEmail"
                  name="nationalIdOrEmail"
                  type="email"
                  placeholder="Enter your email"
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

              {/* Location Selection Fields */}
              <div className="space-y-2">
                <Label htmlFor="province">Province</Label>
                <Select
                  value={formData.province}
                  onValueChange={(value) => handleLocationChange("province", value)}
                  disabled={isLoading.provinces}
                >
                  <SelectTrigger id="province">
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Select
                  value={formData.district}
                  onValueChange={(value) => handleLocationChange("district", value)}
                  disabled={!formData.province || isLoading.districts}
                >
                  <SelectTrigger id="district">
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.districts.map((district) => (
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
                  onValueChange={(value) => handleLocationChange("sector", value)}
                  disabled={!formData.district || isLoading.sectors}
                >
                  <SelectTrigger id="sector">
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.sectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cell">Cell</Label>
                <Select
                  value={formData.cell}
                  onValueChange={(value) => handleLocationChange("cell", value)}
                  disabled={!formData.sector || isLoading.cells}
                >
                  <SelectTrigger id="cell">
                    <SelectValue placeholder="Select cell" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.cells.map((cell) => (
                      <SelectItem key={cell} value={cell}>
                        {cell}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="village">Village</Label>
                <Select
                  value={formData.village}
                  onValueChange={(value) => handleLocationChange("village", value)}
                  disabled={!formData.cell || isLoading.villages}
                >
                  <SelectTrigger id="village">
                    <SelectValue placeholder="Select village" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.villages.map((village) => (
                      <SelectItem key={village} value={village}>
                        {village}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceType">Type of Service</Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) => handleLocationChange("serviceType", value)}
                >
                  <SelectTrigger id="serviceType">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(complaintCategories).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
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
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-rwanda-blue hover:bg-rwanda-blue/90"
            >
              {isSubmitting ? "Submitting..." : "Submit Complaint"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SubmitComplaint;
