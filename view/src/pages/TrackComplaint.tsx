import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {trackComplaintById} from "@/api/complaintApi";
import StatusBadge, { Status } from "@/components/StatusBadge";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface Complaint {
  _id: string;
  trackingCode: string;
  status: Status;
  complaintType: string;
  complaint: string;
  citizenProvince: string;
  citizenDistrict: string;
  citizenSector?: string;
  citizenCell: string;
  citizenVillage: string;
  citizenEmail?: string;
  citizenPhone?: string;
  citizenCountryId: string;
  response?: string;
  adminResponder?: string;
  responseDate?: string;
  postingDate: string;
  __v: number;
}

const TrackComplaint = () => {
  const { t } = useLanguage();
  const [trackingCode, setTrackingCode] = useState("");
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) {
      toast.error(t('errors.trackingCode'));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await trackComplaintById({ trackingCode });
      console.log('API Response:', data); // Debug log
      setComplaint(data);
    } catch (error) {
      console.error("Error tracking complaint:", error);
      setError(t('errors.tracking'));
      toast.error(t('errors.tracking'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        {t('track.title')}
      </h1>
      <p className="text-center text-gray-600 mb-8">
        {t('track.subtitle')}
      </p>
      <form onSubmit={handleTrack} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="trackingCode">{t('track.code')}</Label>
          <div className="flex gap-4">
            <Input
              id="trackingCode"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder={t('track.codePlaceholder')}
              required
            />
            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-600"
              disabled={loading}
            >
              {loading ? t('track.loading') : t('track.button')}
            </Button>
          </div>
        </div>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {complaint && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t('track.complaintDetails')}</span>
              <StatusBadge status={complaint.status} />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700">{t('track.type')}</h3>
              <p className="text-gray-600">{complaint.complaintType}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">{t('track.description')}</h3>
              <p className="text-gray-600">{complaint.complaint}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">{t('track.location')}</h3>
              <p className="text-gray-600">
                {complaint.citizenProvince}, {complaint.citizenDistrict}
                {complaint.citizenSector && `, ${complaint.citizenSector}`}
                {complaint.citizenCell && `, ${complaint.citizenCell}`}
                {complaint.citizenVillage && `, ${complaint.citizenVillage}`}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">{t('track.contact')}</h3>
              <p className="text-gray-600">
                {complaint.citizenEmail && `${t('track.email')}: ${complaint.citizenEmail}`}
                {complaint.citizenPhone && `${t('track.phone')}: ${complaint.citizenPhone}`}
              </p>
            </div>
            {complaint.response && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">{t('track.response')}</h3>
                <p className="text-gray-600 mb-2">{complaint.response}</p>
                {complaint.adminResponder && (
                  <p className="text-sm text-gray-500">
                    {t('track.respondedBy')}: {complaint.adminResponder}
                  </p>
                )}
                {complaint.responseDate && (
                  <p className="text-sm text-gray-500">
                    {t('track.responseDate')}: {new Date(complaint.responseDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
            <div>
              <h3 className="font-medium text-gray-700">{t('track.submitted')}</h3>
              <p className="text-gray-600">
                {new Date(complaint.postingDate).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrackComplaint;
