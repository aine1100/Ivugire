import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";
import { trackComplaintById } from "@/api/complaintApi";

interface Complaint {
  id: string;
  trackingCode: string;
  status: "Pending" | "In Progress" | "Resolved" | "Rejected";
  postingDate: string;
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
}

const TrackComplaint = () => {
  const [trackingId, setTrackingId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [complaint, setComplaint] = useState<Complaint | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      toast.error("Nyamuneka andika nimero y'ikibazo cyawe");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const data = await trackComplaintById({ trackingCode: trackingId });
      setComplaint(data);
      toast.success("Ikibazo cyawe cyabonetse!");
    } catch (error) {
      setComplaint(null);
      toast.error("Ikibazo gifite iyi nimero ntigihari. Nyamuneka suzuma nimero y'ikibazo cyawe.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Kureba Aho Ikibazo Kigeze
      </h1>
      
      <Card className="mb-8 shadow-lg border-none">
        <CardHeader>
          <CardTitle>Shaka Ikibazo</CardTitle>
          <CardDescription>
            Andika nimero y'ikibazo cyawe uzahabwa amakuru kuri cyo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label htmlFor="trackingId" className="block text-sm font-medium mb-1 text-gray-700">
                Nimero y'Ikibazo
              </label>
              <Input
                id="trackingId"
                placeholder="Andika nimero y'ikibazo cyawe"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="w-full"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-green-500 hover:bg-green-600"
              disabled={!trackingId || isLoading}
            >
              {isLoading ? "Turitegereje..." : "Reba Ikibazo"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {complaint && (
        <Card className="border-none shadow-lg">
          <CardHeader className="border-b pb-4">
            <div className="flex justify-between items-center">
              <CardTitle>Amakuru y'ikibazo #{complaint.trackingCode}</CardTitle>
              <StatusBadge status={complaint.status} />
            </div>
            <CardDescription>
              Cyashyizweho: {new Date(complaint.postingDate).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Ubwoko bw'ikibazo</h3>
                  <p className="mt-1 font-medium">{complaint.complaintType}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Akarere</h3>
                  <p className="mt-1 font-medium">{complaint.citizenDistrict}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Umurenge</h3>
                  <p className="mt-1 font-medium">{complaint.citizenSector}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Umudugudu</h3>
                  <p className="mt-1 font-medium">{complaint.citizenVillage}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Inshamake y'ikibazo</h3>
                <p className="p-3 bg-gray-50 rounded-md">{complaint.complaint}</p>
              </div>
              
              {complaint.response && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Igisubizo</h3>
                  <p className="p-3 bg-green-50 rounded-md border border-green-100">
                    {complaint.response}
                    {complaint.adminResponder && (
                      <span className="block text-sm text-gray-500 mt-2">
                        Byatanzwe na: {complaint.adminResponder}
                        {complaint.responseDate && (
                          <span className="block">
                            Kuwa: {new Date(complaint.responseDate).toLocaleDateString()}
                          </span>
                        )}
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <p className="text-sm text-gray-500">
              Shyira nimero #{complaint.trackingCode} mu bubiko.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default TrackComplaint;
