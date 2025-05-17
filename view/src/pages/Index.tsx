import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Index = () => {
  const [feedback, setFeedback] = useState("");
  const [citizenProvince, setCitizenProvince] = useState("");
  const [citizenDistrict, setCitizenDistrict] = useState("");
  const [citizenSector, setCitizenSector] = useState("");
  const [citizenCell, setCitizenCell] = useState("");
  const [citizenVillage, setCitizenVillage] = useState("");
  const [citizenEmail, setCitizenEmail] = useState("");
  const [citizenPhone, setCitizenPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const provinces = [
    "Kigali City",
    "Eastern Province",
    "Northern Province",
    "Southern Province",
    "Western Province"
  ];

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!feedback.trim()) newErrors.feedback = "Andika igitekerezo cyawe.";
    if (!citizenProvince) newErrors.citizenProvince = "Hitamo intara.";
    if (!citizenDistrict.trim()) newErrors.citizenDistrict = "Andika akarere.";
    if (!citizenCell.trim()) newErrors.citizenCell = "Andika akagari.";
    if (!citizenVillage.trim()) newErrors.citizenVillage = "Andika umudugudu.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Nyamuneka wujuje ibisabwa.");
      return;
    }
    // Submit logic here (API call)
    toast.success("Thank you for your feedback!");
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
    <div className="space-y-16 animate-fade-in">
      {/* Hero Section with full width */}
      <section className="relative -mx-4 -mt-6 w-screen py-24 px-4 md:px-8 bg-gradient-to-br from-green-600 to-green-400 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI1MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLW9wYWNpdHk9Ii4zIiBjeD0iNzU5IiBjeT0iMzAwIiByPSIyNTAiLz48Y2lyY2xlIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLW9wYWNpdHk9Ii4zIiBjeD0iNzU5IiBjeT0iMzAwIiByPSIyMDAiLz48Y2lyY2xlIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLW9wYWNpdHk9Ii4zIiBjeD0iNzU5IiBjeT0iMzAwIiByPSIxNTAiLz48L2c+PC9zdmc+')]"></div>
        <div className="max-w-7xl mx-auto">
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Citizen Engagement System
              </h1>
              <p className="text-lg md:text-xl text-white/80">
                Ikoreshwa mu gutanga ibitekerezo n'ibibazo ku mirimo ya Leta mu Rwanda byoroshye kandi mu mucyo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-green-600 hover:bg-white/90 shadow-lg">
                  <Link to="/submit">Tanga Ikibazo</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-green-600 bg-white ">
                  <Link to="/track">Kureba Aho Ikibazo Kigeze</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative w-[500px] h-[600px]">
                <div className="absolute transform -rotate-6 top-4 left-4 w-[500px] h-[540px] bg-white/20 rounded-3xl shadow-xl backdrop-blur-sm border border-white/30">
                  <div className="h-full w-full rounded-3xl overflow-hidden">
                    <img
                      src="citizen.png"
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
          Uko Bikorwa
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
              <h3 className="text-xl font-semibold mb-2">Tanga</h3>
              <p className="text-gray-600">
                Uzuza ifishi y'ikibazo n'ibitekerezo byawe ku bijyanye na serivisi.
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
              <h3 className="text-xl font-semibold mb-2">Kurikirana</h3>
              <p className="text-gray-600">
                Koresha nimero y'ikibazo cyawe kugira ngo ukurikirane aho kigeze.
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
              <h3 className="text-xl font-semibold mb-2">Igisubizo</h3>
              <p className="text-gray-600">
                Kubona amakuru ku gikemuro cy'ikibazo cyawe ukoresheje iyi sisitemu.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Complaint Categories with circular icons */}
      <section className="py-12 bg-gray-50 rounded-3xl gap-8 px-6 items-center flex flex-col justify-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800">
          Amoko y'Ibibazo
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
            <h3 className="font-medium text-lg">Ibibazo Mu Burezi</h3>
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
            <h3 className="font-medium text-lg">Ibibazo Mu Buvuzi</h3>
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
            <h3 className="font-medium text-lg">Ibibazo Mu Bucuruzi</h3>
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
            <h3 className="font-medium text-lg">Ibibazo Mu Bikorwa Remezo</h3>
          </div>
          
        </div>
        
        <Button 
               
               className="bg-green-500 hover:bg-green-600 flex items-center justify-center"
               size="lg"
             >
              Soma Ibindi
             </Button>
       
      </section>

      {/* Statistics Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
            Byakunzwe n'Abaturage bo mu Rwanda
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Abaturage benshi bakoresha iyi sisitemu yo gutanga ibitekerezo n'ibibazo byabo
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-500 mb-2">2,000,000+</div>
            <p className="text-gray-600">Abakoresha sisitemu</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-green-500 mb-2">4.8/5</div>
            <p className="text-gray-600">Amanota batanga</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-green-500 mb-2">90%</div>
            <p className="text-gray-600">Ibibazo byakemurwa</p>
          </div>
        </div>
      </section>

      {/* Feedback Section - New */}
      <section className="py-12 bg-green-50 rounded-3xl px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
            Tubwire Ibitekerezo
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Ibitekerezo byawe ni ingenzi mu guteza imbere serivisi zacu. Tubwire icyo utekereza.
          </p>
          <form onSubmit={handleFeedbackSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="feedback">Igitekerezo *</Label>
              <Textarea
                id="feedback"
                placeholder="Andika hano igitekerezo cyawe..."
                className="min-h-[120px]"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              />
              {errors.feedback && <p className="text-red-500 text-sm mt-1">{errors.feedback}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="citizenProvince">Intara *</Label>
                <Select
                  value={citizenProvince}
                  onValueChange={setCitizenProvince}
                  required
                >
                  <SelectTrigger id="citizenProvince">
                    <SelectValue placeholder="Hitamo intara" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.citizenProvince && <p className="text-red-500 text-sm mt-1">{errors.citizenProvince}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="citizenDistrict">Akarere *</Label>
                <Input
                  id="citizenDistrict"
                  value={citizenDistrict}
                  onChange={e => setCitizenDistrict(e.target.value)}
                  placeholder="Andika akarere"
                  required
                />
                {errors.citizenDistrict && <p className="text-red-500 text-sm mt-1">{errors.citizenDistrict}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="citizenSector">Umurenge</Label>
                <Input
                  id="citizenSector"
                  value={citizenSector}
                  onChange={e => setCitizenSector(e.target.value)}
                  placeholder="Andika umurenge (si ngombwa)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="citizenCell">Akagari *</Label>
                <Input
                  id="citizenCell"
                  value={citizenCell}
                  onChange={e => setCitizenCell(e.target.value)}
                  placeholder="Andika akagari"
                  required
                />
                {errors.citizenCell && <p className="text-red-500 text-sm mt-1">{errors.citizenCell}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="citizenVillage">Umudugudu *</Label>
                <Input
                  id="citizenVillage"
                  value={citizenVillage}
                  onChange={e => setCitizenVillage(e.target.value)}
                  placeholder="Andika umudugudu"
                  required
                />
                {errors.citizenVillage && <p className="text-red-500 text-sm mt-1">{errors.citizenVillage}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="citizenEmail">Imeli</Label>
                <Input
                  id="citizenEmail"
                  type="email"
                  value={citizenEmail}
                  onChange={e => setCitizenEmail(e.target.value)}
                  placeholder="Andika imeli (si ngombwa)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="citizenPhone">Telefoni</Label>
                <Input
                  id="citizenPhone"
                  value={citizenPhone}
                  onChange={e => setCitizenPhone(e.target.value)}
                  placeholder="Andika telefoni (si ngombwa)"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-600"
                size="lg"
              >
                Ohereza Ibitekerezo
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-500 py-12 px-6  text-center text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Witegure gutanga igitekerezo cyawe?
        </h2>
        <p className="text-lg text-white/80 mb-6 max-w-2xl mx-auto">
          Sisitemu yacu yo gutanga ibitekerezo igufasha kuvugana n'abakozi ba Leta bakwiye.
        </p>
        <Button asChild size="lg" className="bg-white text-green-600 hover:bg-white/90">
          <Link to="/submit">Tanga Ikibazo Nonaha</Link>
        </Button>
      </section>
    </div>
  );
};

export default Index;
