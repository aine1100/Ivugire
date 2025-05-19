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
import { useLanguage } from "@/context/LanguageContext";

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

const SubmitComplaint = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const complaintCategories = {
    [t('categories.waterSupply')]: [
      t('subcategories.serviceInterruption'),
      t('subcategories.qualityIssues'),
      t('subcategories.billingProblems'),
      t('subcategories.connectionProblems'),
      t('categories.other'),
    ],
    [t('categories.electricity')]: [
      t('subcategories.powerOutage'),
      t('subcategories.voltageIssues'),
      t('subcategories.billingProblems'),
      t('subcategories.connectionProblems'),
      t('categories.other'),
    ],
    [t('categories.roads')]: [
      t('subcategories.potholes'),
      t('subcategories.trafficSignals'),
      t('subcategories.roadSigns'),
      t('subcategories.constructionIssues'),
      t('categories.other'),
    ],
    [t('categories.healthcare')]: [
      t('subcategories.serviceQuality'),
      t('subcategories.medicationIssues'),
      t('subcategories.staffBehavior'),
      t('subcategories.facilities'),
      t('categories.other'),
    ],
    [t('categories.education')]: [
      t('subcategories.schoolFacilities'),
      t('subcategories.teacherIssues'),
      t('subcategories.curriculum'),
      t('subcategories.administration'),
      t('categories.other'),
    ],
    [t('categories.sanitation')]: [
      t('subcategories.wasteCollection'),
      t('subcategories.publicToilets'),
      t('subcategories.drainage'),
      t('subcategories.cleanliness'),
      t('categories.other'),
    ],
    [t('categories.publicTransport')]: [
      t('subcategories.serviceFrequency'),
      t('subcategories.driverBehavior'),
      t('subcategories.vehicleCondition'),
      t('subcategories.routes'),
      t('categories.other'),
    ],
    [t('categories.security')]: [
      t('subcategories.policeResponse'),
      t('subcategories.crimeReporting'),
      t('subcategories.safetyConcerns'),
      t('subcategories.patrols'),
      t('categories.other'),
    ],
    [t('categories.landServices')]: [
      t('subcategories.registration'),
      t('subcategories.surveying'),
      t('subcategories.documentation'),
      t('subcategories.disputes'),
      t('categories.other'),
    ],
    [t('categories.other')]: [
      t('subcategories.generalComplaint'),
      t('subcategories.suggestion'),
      t('subcategories.inquiry'),
      t('subcategories.feedback'),
    ],
  };

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
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    console.log(`Updating location field ${type} with value:`, value);
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
    console.log(`Updating field ${name} with value:`, value);
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    console.log('Validating form data:', formData);

    if (!formData.fullName.trim()) {
      errors.fullName = t('validation.required');
    } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
      errors.fullName = t('validation.onlyLettersAndSpaces');
    }

    if (!formData.citizenCountryId.trim()) {
      errors.citizenCountryId = t('validation.required');
    } else if (!/^\d{16}$/.test(formData.citizenCountryId)) {
      errors.citizenCountryId = t('validation.nationalId');
    }

    if (!formData.nationalIdOrEmail.trim()) {
      errors.nationalIdOrEmail = t('validation.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.nationalIdOrEmail)) {
      errors.nationalIdOrEmail = t('validation.email');
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = t('validation.required');
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = t('validation.phone');
    }

    if (!formData.province) {
      errors.province = t('validation.required');
    }

    if (!formData.district) {
      errors.district = t('validation.required');
    }

    if (!formData.sector) {
      errors.sector = t('validation.required');
    }

    if (!formData.cell) {
      errors.cell = t('validation.required');
    }

    if (!formData.village) {
      errors.village = t('validation.required');
    }

    if (!formData.serviceType) {
      errors.serviceType = t('validation.required');
    }

    if (!formData.description.trim()) {
      errors.description = t('validation.required');
    } else if (formData.description.length < 0) {
      errors.description = t('validation.minLength').replace('{min}', '10');
    }

    console.log('Validation errors:', errors);
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Form submitted with data:', formData);

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      console.log('Form validation failed with errors:', errors);
      toast({
        title: t('submit.error'),
        description: Object.values(errors)[0] || t('validation.required'),
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
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
      console.log('Submitting complaint data:', complaintData);

      const response = await createComplaint(complaintData);
      toast({
        title: t('submit.success'),
        description: t('submit.successMessage'),
      });
      navigate(`/track?complaintId=${response.id}`);
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast({
        title: t('submit.error'),
        description: t('submit.errorMessage'),
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
                <Label htmlFor="fullName">{t('submit.fullName')}</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder={t('submit.fullNamePlaceholder')}
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="citizenCountryId">{t('submit.nationalId')}</Label>
                <Input
                  id="citizenCountryId"
                  name="citizenCountryId"
                  type="text"
                  placeholder={t('submit.nationalIdPlaceholder')}
                  value={formData.citizenCountryId}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationalIdOrEmail">{t('submit.email')}</Label>
                <Input
                  id="nationalIdOrEmail"
                  name="nationalIdOrEmail"
                  type="email"
                  placeholder={t('submit.emailPlaceholder')}
                  value={formData.nationalIdOrEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">{t('submit.phone')}</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder={t('submit.phonePlaceholder')}
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Location Selection Fields */}
              <div className="space-y-2">
                <Label htmlFor="province">{t('submit.province')}</Label>
                <Select
                  value={formData.province}
                  onValueChange={(value) => handleLocationChange("province", value)}
                  disabled={isLoading.provinces}
                >
                  <SelectTrigger id="province">
                    <SelectValue placeholder={t('submit.selectProvince')} />
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
                <Label htmlFor="district">{t('submit.district')}</Label>
                <Select
                  value={formData.district}
                  onValueChange={(value) => handleLocationChange("district", value)}
                  disabled={!formData.province || isLoading.districts}
                >
                  <SelectTrigger id="district">
                    <SelectValue placeholder={t('submit.selectDistrict')} />
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
                <Label htmlFor="sector">{t('submit.sector')}</Label>
                <Select
                  value={formData.sector}
                  onValueChange={(value) => handleLocationChange("sector", value)}
                  disabled={!formData.district || isLoading.sectors}
                >
                  <SelectTrigger id="sector">
                    <SelectValue placeholder={t('submit.selectSector')} />
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
                <Label htmlFor="cell">{t('submit.cell')}</Label>
                <Select
                  value={formData.cell}
                  onValueChange={(value) => handleLocationChange("cell", value)}
                  disabled={!formData.sector || isLoading.cells}
                >
                  <SelectTrigger id="cell">
                    <SelectValue placeholder={t('submit.selectCell')} />
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
                <Label htmlFor="village">{t('submit.village')}</Label>
                <Select
                  value={formData.village}
                  onValueChange={(value) => handleLocationChange("village", value)}
                  disabled={!formData.cell || isLoading.villages}
                >
                  <SelectTrigger id="village">
                    <SelectValue placeholder={t('submit.selectVillage')} />
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
                <Label htmlFor="serviceType">{t('submit.serviceType')}</Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) => handleLocationChange("serviceType", value)}
                >
                  <SelectTrigger id="serviceType">
                    <SelectValue placeholder={t('submit.selectServiceType')} />
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
              <Label htmlFor="description">{t('submit.description')}</Label>
              <Textarea
                id="description"
                name="description"
                placeholder={t('submit.descriptionPlaceholder')}
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
              {t('submit.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-rwanda-blue hover:bg-rwanda-blue/90"
            >
              {isSubmitting ? t('submit.submitting') : t('submit.submit')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SubmitComplaint;
