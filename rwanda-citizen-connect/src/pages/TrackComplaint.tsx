
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useComplaints } from "@/context/ComplaintContext";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";

const TrackComplaint = () => {
  const [trackingId, setTrackingId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [complaint, setComplaint] = useState<any>(null);
  const { getComplaint } = useComplaints();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Add a small delay to simulate network request
    setTimeout(() => {
      const foundComplaint = getComplaint(trackingId);
      
      if (foundComplaint) {
        setComplaint(foundComplaint);
        toast.success("Ikibazo cyawe cyabonetse!");
      } else {
        setComplaint(null);
        toast.error("Ikibazo gifite iyi nimero ntigihari. Nyamuneka suzuma nimero y'ikibazo cyawe.");
      }
      
      setIsLoading(false);
    }, 600);
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
                placeholder="Urugero: CES-2023-001"
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
              <CardTitle>Amakuru y'ikibazo #{complaint.id}</CardTitle>
              <StatusBadge status={complaint.status} />
            </div>
            <CardDescription>
              Cyashyizweho: {new Date(complaint.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Uwatanze Ikibazo</h3>
                  <p className="mt-1 font-medium">{complaint.fullName}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Serivisi Kireba</h3>
                  <p className="mt-1 font-medium">{complaint.serviceType}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Akarere</h3>
                  <p className="mt-1 font-medium">{complaint.district}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Umurenge</h3>
                  <p className="mt-1 font-medium">{complaint.sector}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Inshamake y'ikibazo</h3>
                <p className="p-3 bg-gray-50 rounded-md">{complaint.description}</p>
              </div>
              
              {complaint.response && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Igisubizo</h3>
                  <p className="p-3 bg-green-50 rounded-md border border-green-100">{complaint.response}</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <p className="text-sm text-gray-500">
              Shyira nimero #{complaint.id} mu bubiko.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default TrackComplaint;
