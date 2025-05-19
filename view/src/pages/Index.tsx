import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { postFeedback } from "@/api/feedbackApi";
import { useLanguage } from "@/context/LanguageContext";

const API_BASE_URL = import.meta.env.VITE_LOCATIONS_URL;

interface ApiResponse {
  status: string;
  provinces?: string[];
  districts?: string[];
  sectors?: string[];
  cells?: string[];
  villages?: string[];
}

const Index = () => {
  const { t } = useLanguage();
  const [feedback, setFeedback] = useState("");
  const [citizenProvince, setCitizenProvince] = useState("");
  const [citizenDistrict, setCitizenDistrict] = useState("");
  const [citizenSector, setCitizenSector] = useState("");
  const [citizenCell, setCitizenCell] = useState("");
  const [citizenVillage, setCitizenVillage] = useState("");
  const [citizenEmail, setCitizenEmail] = useState("");
  const [citizenPhone, setCitizenPhone] = useState("");
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
  }>(
    {
      provinces: [],
      districts: [],
      sectors: [],
      cells: [],
      villages: [],
    }
  );

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoading((prev) => ({ ...prev, provinces: true }));
      try {
        const response = await fetch(`${API_BASE_URL}/provinces`);
        if (!response.ok) throw new Error('Failed to fetch provinces');
        const data: ApiResponse = await response.json();
        if (data.status === "success" && data.provinces) {
          setLocations((prev) => ({ ...prev, provinces: data.provinces || [] }));
        }
      } catch (error) {
        toast.error("Failed to load provinces. Please try again.");
      } finally {
        setIsLoading((prev) => ({ ...prev, provinces: false }));
      }
    };

    fetchProvinces();
  }, [toast]);

  // Fetch districts when province changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!citizenProvince) return;

      setIsLoading((prev) => ({ ...prev, districts: true }));
      try {
        const encodedProvince = encodeURIComponent(citizenProvince);
        const response = await fetch(
          `${API_BASE_URL}/province/${encodedProvince}/districts`
        );
        if (!response.ok) throw new Error('Failed to fetch districts');
        const data: ApiResponse = await response.json();
        if (data.status === "success" && data.districts) {
          setLocations((prev) => ({ ...prev, districts: data.districts || [] }));
        }
      } catch (error) {
        toast.error("Failed to load districts. Please try again.");
      } finally {
        setIsLoading((prev) => ({ ...prev, districts: false }));
      }
    };

    fetchDistricts();
  }, [citizenProvince, toast]);

  // Fetch sectors when district changes
  useEffect(() => {
    const fetchSectors = async () => {
      if (!citizenProvince || !citizenDistrict) return;

      setIsLoading((prev) => ({ ...prev, sectors: true }));
      try {
        const encodedProvince = encodeURIComponent(citizenProvince);
        const encodedDistrict = encodeURIComponent(citizenDistrict);
        const response = await fetch(
          `${API_BASE_URL}/province/${encodedProvince}/district/${encodedDistrict}/sector`
        );
        if (!response.ok) throw new Error('Failed to fetch sectors');
        const data: ApiResponse = await response.json();
        if (data.status === "success" && data.sectors) {
          setLocations((prev) => ({ ...prev, sectors: data.sectors || [] }));
        }
      } catch (error) {
        toast.error("Failed to load sectors. Please try again.");
      } finally {
        setIsLoading((prev) => ({ ...prev, sectors: false }));
      }
    };

    fetchSectors();
  }, [citizenProvince, citizenDistrict, toast]);

  // Fetch cells when sector changes
  useEffect(() => {
    const fetchCells = async () => {
      if (!citizenProvince || !citizenDistrict || !citizenSector) return;

      setIsLoading((prev) => ({ ...prev, cells: true }));
      try {
        const encodedProvince = encodeURIComponent(citizenProvince);
        const encodedDistrict = encodeURIComponent(citizenDistrict);
        const encodedSector = encodeURIComponent(citizenSector);
        const response = await fetch(
          `${API_BASE_URL}/province/${encodedProvince}/district/${encodedDistrict}/sector/${encodedSector}/cells`
        );
        if (!response.ok) throw new Error('Failed to fetch cells');
        const data: ApiResponse = await response.json();
        if (data.status === "success" && data.cells) {
          setLocations((prev) => ({ ...prev, cells: data.cells || [] }));
        }
      } catch (error) {
        toast.error("Failed to load cells. Please try again.");
      } finally {
        setIsLoading((prev) => ({ ...prev, cells: false }));
      }
    };

    fetchCells();
  }, [citizenProvince, citizenDistrict, citizenSector, toast]);

  // Fetch villages when cell changes
  useEffect(() => {
    const fetchVillages = async () => {
      if (!citizenProvince || !citizenDistrict || !citizenSector || !citizenCell) return;

      setIsLoading((prev) => ({ ...prev, villages: true }));
      try {
        const encodedProvince = encodeURIComponent(citizenProvince);
        const encodedDistrict = encodeURIComponent(citizenDistrict);
        const encodedSector = encodeURIComponent(citizenSector);
        const encodedCell = encodeURIComponent(citizenCell);
        const response = await fetch(
          `${API_BASE_URL}/province/${encodedProvince}/district/${encodedDistrict}/sector/${encodedSector}/cell/${encodedCell}/villages`
        );
        if (!response.ok) throw new Error('Failed to fetch villages');
        const data: ApiResponse = await response.json();
        if (data.status === "success" && data.villages) {
          setLocations((prev) => ({ ...prev, villages: data.villages || [] }));
        }
      } catch (error) {
        toast.error("Failed to load villages. Please try again.");
      } finally {
        setIsLoading((prev) => ({ ...prev, villages: false }));
      }
    };

    fetchVillages();
  }, [citizenProvince, citizenDistrict, citizenSector, citizenCell, toast]);

  const handleLocationChange = (type: string, value: string) => {
    const resetFields: Record<string, React.Dispatch<React.SetStateAction<string>>> = {
      province: setCitizenProvince,
      district: setCitizenDistrict,
      sector: setCitizenSector,
      cell: setCitizenCell,
      village: setCitizenVillage,
    };

    const resetBelow = (level: string) => {
      const levels = ['province', 'district', 'sector', 'cell', 'village'];
      const startIndex = levels.indexOf(level);
      for (let i = startIndex + 1; i < levels.length; i++) {
        resetFields[levels[i]]('');
      }
    };

    resetFields[type](value);
    resetBelow(type);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!feedback.trim()) newErrors.feedback = t('errors.feedbackRequired');
    if (!citizenProvince) newErrors.citizenProvince = t('errors.provinceRequired');
    if (!citizenDistrict.trim()) newErrors.citizenDistrict = t('errors.districtRequired');
    if (!citizenCell.trim()) newErrors.citizenCell = t('errors.cellRequired');
    if (!citizenVillage.trim()) newErrors.citizenVillage = t('errors.villageRequired');
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error(t('errors.requiredFields'));
      return;
    }
    postFeedback({
      feedback,
      citizenProvince,
      citizenDistrict,
      citizenSector,
      citizenCell,
      citizenVillage,
      citizenEmail,
      citizenPhone,
    })
    .then((response) => {
      console.log("Feedback sent successfully:", response);
      toast.success(t('feedback.successMessage'));
    })
    .catch((error) => {
      console.error("Error sending feedback:", error);
      toast.error(t('feedback.errorMessage'));
    });
   
    setFeedback("");
    setCitizenProvince("");
    setCitizenDistrict("");
    setCitizenSector("");
    setCitizenCell("");
    setCitizenVillage("");
    setCitizenEmail("");
    setCitizenPhone("");
    setErrors({});
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative -mx-4 -mt-6 w-screen py-24 px-4 md:px-8 bg-gradient-to-br from-green-600 to-green-400 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI1MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLW9wYWNpdHk9Ii4zIiBjeD0iNzU5IiBjeT0iMzAwIiByPSIyNTAiLz48Y2lyY2xlIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLW9wYWNpdHk9Ii4zIiBjeD0iNzU5IiBjeT0iMzAwIiByPSIyMDAiLz48Y2lyY2xlIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLW9wYWNpdHk9Ii4zIiBjeD0iNzU5IiBjeT0iMzAwIiByPSIxNTAiLz48L2c+PC9zdmc+')]"></div>
        <div className="max-w-7xl mx-auto">
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                {t('hero.title')}
              </h1>
              <p className="text-lg md:text-xl text-white/80">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-green-600 hover:bg-white/90 shadow-lg">
                  <Link to="/submit">{t('hero.submit')}</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-green-600 bg-white">
                  <Link to="/track">{t('hero.track')}</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative w-[500px] h-[600px]">
                <div className="absolute transform -rotate-6 top-4 left-4 w-[500px] h-[540px] bg-white/20 rounded-3xl shadow-xl backdrop-blur-sm border border-white/30">
                  <div className="h-full w-full rounded-3xl overflow-hidden">
                    <img
                      src="citizen.jpg"
                      alt="Mobile app view"
                      className="object-cover h-full w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800">
          {t('howItWorks.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-lg hover:shadow-xl transition-all">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4 text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('howItWorks.submit')}</h3>
              <p className="text-gray-600">
                {t('howItWorks.submitDesc')}
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-all">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4 text-green-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('howItWorks.track')}</h3>
              <p className="text-gray-600">
                {t('howItWorks.trackDesc')}
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-all">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4 text-green-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('howItWorks.response')}</h3>
              <p className="text-gray-600">
                {t('howItWorks.responseDesc')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Complaint Categories */}
      <section className="py-12 bg-gray-50 rounded-3xl gap-8 px-6 items-center flex flex-col justify-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800">
          {t('categories.title')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-all">
            <div className="h-16 w-16 mx-auto mb-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-lg">{t('categories.education')}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-all">
            <div className="h-16 w-16 mx-auto mb-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                />
              </svg>
            </div>
            <h3 className="font-medium text-lg">{t('categories.healthcare')}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-all">
            <div className="h-16 w-16 mx-auto mb-4 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-lg">{t('categories.business')}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-all">
            <div className="h-16 w-16 mx-auto mb-4 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 21h19.5m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-lg">{t('categories.infrastructure')}</h3>
          </div>
        </div>
        
        <Button 
          className="bg-green-500 hover:bg-green-600 flex items-center justify-center"
          size="lg"
        >
          {t('readMore')}
        </Button>
      </section>

      {/* Statistics Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
            {t('stats.title')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('stats.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-500 mb-2">2,000,000+</div>
            <p className="text-gray-600">{t('stats.users')}</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-green-500 mb-2">4.8/5</div>
            <p className="text-gray-600">{t('stats.rating')}</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-green-500 mb-2">90%</div>
            <p className="text-gray-600">{t('stats.resolved')}</p>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-12 bg-green-50 rounded-3xl px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
            {t('feedback.title')}
          </h2>
          <p className="text-center text-gray-600 mb-8">
            {t('feedback.subtitle')}
          </p>
          <form onSubmit={handleFeedbackSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="feedback">{t('feedback.feedback')}</Label>
              <Textarea
                id="feedback"
                placeholder={t('feedback.feedbackPlaceholder')}
                className="min-h-[120px]"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              />
              {errors.feedback && <p className="text-red-500 text-sm mt-1">{errors.feedback}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="citizenProvince">{t('feedback.province')}</Label>
                <Select
                  value={citizenProvince}
                  onValueChange={(value) => handleLocationChange('province', value)}
                  required
                  disabled={isLoading.provinces}
                >
                  <SelectTrigger id="citizenProvince">
                    <SelectValue placeholder={t('feedback.selectProvincePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.provinces.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.citizenProvince && <p className="text-red-500 text-sm mt-1">{errors.citizenProvince}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="citizenDistrict">{t('feedback.district')}</Label>
                <Select
                  value={citizenDistrict}
                  onValueChange={(value) => handleLocationChange('district', value)}
                  required
                  disabled={!citizenProvince || isLoading.districts}
                >
                   <SelectTrigger id="citizenDistrict">
                    <SelectValue placeholder={t('feedback.selectDistrictPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.districts.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.citizenDistrict && <p className="text-red-500 text-sm mt-1">{errors.citizenDistrict}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="citizenSector">{t('feedback.sector')}</Label>
                 <Select
                  value={citizenSector}
                  onValueChange={(value) => handleLocationChange('sector', value)}
                  disabled={!citizenDistrict || isLoading.sectors}
                >
                  <SelectTrigger id="citizenSector">
                    <SelectValue placeholder={t('feedback.selectSectorPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.sectors.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="citizenCell">{t('feedback.cell')}</Label>
                 <Select
                  value={citizenCell}
                  onValueChange={(value) => handleLocationChange('cell', value)}
                  required
                  disabled={!citizenSector || isLoading.cells}
                >
                  <SelectTrigger id="citizenCell">
                    <SelectValue placeholder={t('feedback.selectCellPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.cells.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.citizenCell && <p className="text-red-500 text-sm mt-1">{errors.citizenCell}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="citizenVillage">{t('feedback.village')}</Label>
                <Select
                  value={citizenVillage}
                  onValueChange={(value) => handleLocationChange('village', value)}
                  required
                  disabled={!citizenCell || isLoading.villages}
                >
                  <SelectTrigger id="citizenVillage">
                    <SelectValue placeholder={t('feedback.selectVillagePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.villages.map((v) => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.citizenVillage && <p className="text-red-500 text-sm mt-1">{errors.citizenVillage}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="citizenEmail">{t('feedback.email')}</Label>
                <Input
                  id="citizenEmail"
                  type="email"
                  value={citizenEmail}
                  onChange={e => setCitizenEmail(e.target.value)}
                  placeholder={t('feedback.emailPlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="citizenPhone">{t('feedback.phone')}</Label>
                <Input
                  id="citizenPhone"
                  value={citizenPhone}
                  onChange={e => setCitizenPhone(e.target.value)}
                  placeholder={t('feedback.phonePlaceholder')}
                />
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-600"
                size="lg"
              >
                {t('feedback.submit')}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-500 py-12 px-6 text-center text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          {t('cta.title')}
        </h2>
        <p className="text-lg text-white/80 mb-6 max-w-2xl mx-auto">
          {t('cta.subtitle')}
        </p>
        <Button asChild size="lg" className="bg-white text-green-600 hover:bg-white/90">
          <Link to="/submit">{t('cta.button')}</Link>
        </Button>
      </section>
    </div>
  );
};

export default Index;
