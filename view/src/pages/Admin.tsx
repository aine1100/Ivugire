import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useComplaints } from "@/context/ComplaintContext";
import StatusBadge from "@/components/StatusBadge";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllComplaints, getAllFeedback, updateComplaintStatus } from "@/api/adminApi";
import { MessageSquare } from "lucide-react";
import axios from "axios";
import { queryClient } from "../lib/queryClient";

const API_BASE_URL = import.meta.env.VITE_LOCATIONS_URL;

interface ApiResponse {
  status: string;
  provinces?: string[];
  districts?: string[];
  sectors?: string[];
  cells?: string[];
  villages?: string[];
}

// Define Status type at the top level
type Status = "Submitted" | "Under Review" | "In Progress" | "Resolved" | "Rejected";

interface Complaint {
  _id: string;
  complaint: string;
  complaintType: string;
  citizenCountryId: string;
  citizenProvince: string;
  citizenDistrict: string;
  citizenSector: string;
  citizenCell: string;
  citizenVillage: string;
  citizenEmail: string;
  citizenPhone: string;
  trackingCode: string;
  status: Status;
  response?: string;
  adminResponder?: string;
  responseDate?: string;
  postingDate: string;
}

interface Feedback {
  _id: string;
  feedback: string;
  citizenProvince: string;
  citizenDistrict: string;
  citizenSector: string;
  citizenCell: string;
  citizenVillage: string;
  citizenEmail: string;
  citizenPhone: string;
  __v: number;
}

interface ProvinceStats {
  total: number;
  byStatus: Record<Status, number>;
  districts: Record<string, {
    total: number;
    byStatus: Record<Status, number>;
  }>;
}

interface ComplaintStatistics {
  total: number;
  byStatus: Record<string, number>;
  byProvince: Record<string, number>;
  byDistrict: Record<string, number>;
  byDistrictAndStatus: Record<string, Record<string, number>>;
}

const Admin = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [filters, setFilters] = useState({
    searchTerm: "",
    status: "all" as "all" | Status,
    category: "all",
    district: "all",
    province: "all"
  });
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [responseText, setResponseText] = useState("");
  const [newStatus, setNewStatus] = useState<Status>("Submitted");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [currentView, setCurrentView] = useState("dashboard");
  const [statusCounts, setStatusCounts] = useState<Record<Status, number>>({
    "Submitted": 0,
    "Under Review": 0,
    "In Progress": 0,
    "Resolved": 0,
    "Rejected": 0
  });
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [provinceStats, setProvinceStats] = useState<Record<string, ProvinceStats>>({});
  const [districtStats, setDistrictStats] = useState<Record<string, {
    total: number;
    byStatus: Record<Status, number>;
  }>>({});
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [locations, setLocations] = useState<{
    provinces: string[];
    districts: string[];
  }>({
    provinces: [],
    districts: [],
  });

  const [isLoading, setIsLoading] = useState({
    provinces: false,
    districts: false,
  });

  const [feedbackStats, setFeedbackStats] = useState<{
    total: number;
    byProvince: Record<string, number>;
    byDistrict: Record<string, number>;
  }>({
    total: 0,
    byProvince: {},
    byDistrict: {}
  });

  const [statistics, setStatistics] = useState<ComplaintStatistics | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  // Add getStatusCount function
  const getStatusCount = (status: Status) => {
    return statusCounts[status] || 0;
  };

  // Update the query to use proper typing
  const { data: complaintsData, isLoading: isLoadingComplaints, error: complaintsError } = useQuery({
    queryKey: ['complaints'],
    queryFn: getAllComplaints,
    select: (data) => data.map((complaint: Complaint) => ({
      ...complaint,
      status: complaint.status as Status
    }))
  });

  // Fetch feedback
  const { data: feedbackData, isLoading: isLoadingFeedback, error: feedbackError } = useQuery({
    queryKey: ['feedback'],
    queryFn: getAllFeedback
  });

  // Fetch statistics
  const { data: statsData } = useQuery<ComplaintStatistics>({
    queryKey: ['complaintStatistics'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/complaint/statistics`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    }
  });

  // Get the current tab from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    
    if (tab) {
      setCurrentView(tab);
    } else {
      setCurrentView("dashboard");
    }
  }, [location.search]);

  // Update useEffect for filtering
  useEffect(() => {
    if (!complaintsData) return;

    // Apply filters
    let results = [...complaintsData];

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      results = results.filter(
        (complaint) =>
          (complaint.citizenEmail?.toLowerCase().includes(term) || false) ||
          (complaint.trackingCode.toLowerCase().includes(term)) ||
          (complaint.complaint?.toLowerCase().includes(term) || false)
      );
    }

    if (filters.province !== "all") {
      results = results.filter(complaint => complaint.citizenProvince === filters.province);
    }

    if (filters.district !== "all") {
      results = results.filter(complaint => complaint.citizenDistrict === filters.district);
    }

    if (filters.status !== "all") {
      results = results.filter(complaint => complaint.status === filters.status);
    }

    if (filters.category !== "all") {
      results = results.filter(complaint => complaint.complaintType === filters.category);
    }

    setFilteredComplaints(results);

    // Calculate statistics
    const statusData: Record<Status, number> = {
      "Submitted": 0,
      "Under Review": 0,
      "In Progress": 0,
      "Resolved": 0,
      "Rejected": 0
    };

    const provinceData: Record<string, ProvinceStats> = {};

    results.forEach((complaint) => {
      // Count by status
      statusData[complaint.status] = (statusData[complaint.status] || 0) + 1;
      
      // Count by province and district
      if (!provinceData[complaint.citizenProvince]) {
        provinceData[complaint.citizenProvince] = {
          total: 0,
          byStatus: {
            "Submitted": 0,
            "Under Review": 0,
            "In Progress": 0,
            "Resolved": 0,
            "Rejected": 0
          },
          districts: {}
        };
      }

      if (!provinceData[complaint.citizenProvince].districts[complaint.citizenDistrict]) {
        provinceData[complaint.citizenProvince].districts[complaint.citizenDistrict] = {
          total: 0,
          byStatus: {
            "Submitted": 0,
            "Under Review": 0,
            "In Progress": 0,
            "Resolved": 0,
            "Rejected": 0
          }
        };
      }

      provinceData[complaint.citizenProvince].total++;
      provinceData[complaint.citizenProvince].byStatus[complaint.status]++;
      provinceData[complaint.citizenProvince].districts[complaint.citizenDistrict].total++;
      provinceData[complaint.citizenProvince].districts[complaint.citizenDistrict].byStatus[complaint.status]++;
    });

    setStatusCounts(statusData);
    setProvinceStats(provinceData);

    // Calculate category statistics
    const categoryData: Record<string, number> = {};
    results.forEach((complaint) => {
      categoryData[complaint.complaintType] = (categoryData[complaint.complaintType] || 0) + 1;
    });
    setCategoryCounts(categoryData);
  }, [complaintsData, filters]);

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
      if (!filters.province || filters.province === "all") {
        setLocations(prev => ({ ...prev, districts: [] }));
        return;
      }
      
      setIsLoading(prev => ({ ...prev, districts: true }));
      try {
        const encodedProvince = encodeURIComponent(filters.province);
        const response = await fetch(
          `${API_BASE_URL}/province/${encodedProvince}/districts`
        );
        if (!response.ok) throw new Error('Failed to fetch districts');
        const data: ApiResponse = await response.json();
        if (data.status === "success" && data.districts) {
          setLocations(prev => ({ ...prev, districts: data.districts || [] }));
        }
      } catch (error) {
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
  }, [filters.province, toast]);

  // Update feedback statistics when data changes
  useEffect(() => {
    if (!feedbackData) return;

    const stats = {
      total: feedbackData.length,
      byProvince: {} as Record<string, number>,
      byDistrict: {} as Record<string, number>
    };

    feedbackData.forEach((item) => {
      if (item.citizenProvince) {
        stats.byProvince[item.citizenProvince] = (stats.byProvince[item.citizenProvince] || 0) + 1;
      }
      if (item.citizenDistrict) {
        stats.byDistrict[item.citizenDistrict] = (stats.byDistrict[item.citizenDistrict] || 0) + 1;
      }
    });

    setFeedbackStats(stats);
  }, [feedbackData]);

  // Update useEffect to handle stats data
  useEffect(() => {
    if (statsData) {
      setStatistics(statsData);
    }
  }, [statsData]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }).format(date);
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      searchTerm: e.target.value,
    });
  };

  const handleViewDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setResponseText(complaint.response || "");
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedComplaint) return;
    
    setIsSubmitting(true);
    
    try {
      const adminResponder = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).username : 'Admin';
      const token = localStorage.getItem('token');
      
      console.log('Sending update request:', {
        url: `${import.meta.env.VITE_BACKEND_URL}/api/complaints/update/${selectedComplaint._id}`,
        data: {
          status: newStatus,
          response: responseText,
          adminResponder
        }
      });

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/complaints/update/${selectedComplaint._id}`,
        {
          status: newStatus,
          response: responseText,
          adminResponder
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Update response:', response.data);

      // Refetch complaints and statistics
      await queryClient.invalidateQueries({ queryKey: ['complaints'] });
      await queryClient.invalidateQueries({ queryKey: ['complaintStatistics'] });
      
      toast({
        title: "Success",
        description: "Complaint updated successfully",
      });
      
      setIsDialogOpen(false);
      setResponseText(""); // Clear response text after successful update
    } catch (error) {
      console.error('Error updating complaint:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update complaint",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingComplaints || isLoadingFeedback) {
    return <div>Loading...</div>;
  }

  if (complaintsError || feedbackError) {
    return <div>Error loading data</div>;
  }

  // Convert status data for chart
  const statusChartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
    color: 
      status === "Resolved" ? "#10b981" :
      status === "In Progress" ? "#8b5cf6" :
      status === "Under Review" ? "#f59e0b" :
      "#3b82f6"
  }));

  // Extract unique categories and districts for filters
  const categories = Array.from(new Set(complaintsData.map(c => c.complaintType)));
  const districts = Array.from(new Set(complaintsData.map(c => c.citizenDistrict)));

  // Get unique provinces
  const provinces = Array.from(new Set(complaintsData?.map(c => c.citizenProvince) || []));

  const switchTab = (tab: string) => {
    setCurrentView(tab);
    navigate(`/admin/dashboard${tab !== 'dashboard' ? `?tab=${tab}` : ''}`);
  };

  const renderComplaintsTab = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Input
            placeholder="Search"
            value={filters.searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <Select
          value={filters.province}
          onValueChange={(value) => {
            setFilters(prev => ({ ...prev, province: value, district: "all" }));
          }}
          disabled={isLoading.provinces}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Province" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Provinces</SelectItem>
            {locations.provinces.map((province) => (
              <SelectItem key={province} value={province}>
                {province}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.district}
          onValueChange={(value) => handleFilterChange("district", value)}
          disabled={filters.province === "all" || isLoading.districts}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select District" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Districts</SelectItem>
            {locations.districts.map((district) => (
              <SelectItem key={district} value={district}>
                {district}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Submitted">Submitted</SelectItem>
            <SelectItem value="Under Review">Under Review</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Complaints Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tracking Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredComplaints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                  No complaints found matching your filters
                </TableCell>
              </TableRow>
            ) : (
              filteredComplaints.map((complaint) => (
                <TableRow key={complaint._id}>
                  <TableCell>{complaint.trackingCode}</TableCell>
                  <TableCell>{complaint.complaintType}</TableCell>
                  <TableCell>
                    <StatusBadge status={complaint.status} />
                  </TableCell>
                  <TableCell>{formatDate(complaint.postingDate)}</TableCell>
                  <TableCell>
                    {complaint.citizenDistrict}, {complaint.citizenSector}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{complaint.citizenEmail}</div>
                      <div className="text-gray-500">{complaint.citizenPhone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(complaint)}
                    >
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Complaint Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{filteredComplaints.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">By Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{status}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">By Province</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {Object.entries(provinceStats).map(([province, stats]) => (
                <div key={province} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{province}</span>
                  <span className="font-medium">{stats.total}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">By District</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {Object.entries(districtStats).map(([district, stats]) => (
                <div key={district} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{district}</span>
                  <span className="font-medium">{stats.total}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Province Statistics */}
      {filters.province !== "all" && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Statistics for {filters.province}</CardTitle>
            <CardDescription>Complaints by District and Status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(provinceStats[filters.province]?.districts || {}).map(([district, stats]) => (
                <div key={district} className="border-b pb-4">
                  <h3 className="font-semibold text-lg">{district}</h3>
                  <p className="text-sm text-gray-500">Total: {stats.total}</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                    {Object.entries(stats.byStatus).map(([status, count]) => (
                      <div key={status} className="bg-gray-50 p-2 rounded">
                        <p className="text-sm font-medium text-gray-600">{status}</p>
                        <p className="text-lg font-bold">{count}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Citizen Engagement System</h1>
        <div className="text-sm text-gray-500">
          Staff: Admin User | Role: Administrator
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border shadow-sm">
          <CardContent className="p-4 flex items-center">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Complaints</p>
              <p className="text-3xl font-bold">{filteredComplaints.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-4 flex items-center">
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-3xl font-bold">
                {getStatusCount("Submitted") + getStatusCount("Under Review")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-4 flex items-center">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-3xl font-bold">{getStatusCount("In Progress")}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-4 flex items-center">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Resolved</p>
              <p className="text-3xl font-bold">{getStatusCount("Resolved")}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-4 flex items-center">
            <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Feedback</p>
              <p className="text-3xl font-bold">{feedbackData?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Navigation Tabs */}
      <Tabs value={currentView} onValueChange={switchTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        
        {/* Dashboard Tab Content */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Recent Complaints Table - Similar to reference image */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Recent Complaints</CardTitle>
              <CardDescription>Latest complaints received from citizens</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>TRACKING CODE</TableHead>
                      <TableHead>TYPE</TableHead>
                      <TableHead>STATUS</TableHead>
                      <TableHead>SUBMITTED</TableHead>
                      <TableHead>ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complaintsData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                          No complaints found
                        </TableCell>
                      </TableRow>
                    ) : (
                      complaintsData.slice(0, 5).map((complaint) => (
                        <TableRow key={complaint._id}>
                          <TableCell className="font-medium">{complaint.trackingCode}</TableCell>
                          <TableCell>{complaint.complaintType}</TableCell>
                          <TableCell>
                            <StatusBadge status={complaint.status as Status} />
                          </TableCell>
                          <TableCell>{formatDate(complaint.postingDate)}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(complaint)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Complaints by Category</CardTitle>
                <CardDescription>Distribution of complaints by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer config={{}} className="h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Object.entries(categoryCounts).map(([category, count]) => ({
                          name: category,
                          value: count,
                        }))}
                        margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
                      >
                        <XAxis 
                          dataKey="name" 
                          angle={-45} 
                          textAnchor="end"
                          height={100}
                          interval={0}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis />
                        <RechartsTooltip 
                          formatter={(value: number) => [`${value} complaints`, 'Count']}
                          labelFormatter={(label) => `Category: ${label}`}
                        />
                        <Bar 
                          dataKey="value" 
                          fill="#22c55e"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
                <CardDescription>Current status of all complaints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer config={{}} className="h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Complaints Tab Content */}
        <TabsContent value="complaints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Complaints Management</CardTitle>
              <CardDescription>Manage and respond to citizen complaints</CardDescription>
              <Tabs defaultValue="all" className="mt-4" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-5 max-w-lg">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="Submitted">Submitted</TabsTrigger>
                  <TabsTrigger value="Under Review">Under Review</TabsTrigger>
                  <TabsTrigger value="In Progress">In Progress</TabsTrigger>
                  <TabsTrigger value="Resolved">Resolved</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              {renderComplaintsTab()}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Feedback Tab Content */}
        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Citizen Feedback</CardTitle>
              <CardDescription>Review feedback submitted by citizens</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Feedback Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Feedback</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feedbackData?.map((item: Feedback) => (
                        <TableRow key={item._id}>
                          <TableCell className="max-w-md">
                            <p className="truncate">{item.feedback}</p>
                          </TableCell>
                            <TableCell>
                            <div className="text-sm">
                              <div>{item.citizenProvince}</div>
                              <div className="text-gray-500">
                                {item.citizenDistrict}, {item.citizenSector}
                              </div>
                            </div>
                            </TableCell>
                            <TableCell>
                            <div className="text-sm">
                              <div>{item.citizenEmail}</div>
                              <div className="text-gray-500">{item.citizenPhone}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">View Details</Button>
                            </TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Feedback Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Total Feedback</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{feedbackStats.total}</p>
            </CardContent>
          </Card>
        
          <Card>
            <CardHeader>
                      <CardTitle className="text-lg">By Province</CardTitle>
            </CardHeader>
            <CardContent>
                      <div className="space-y-2">
                        {Object.entries(feedbackStats.byProvince).map(([province, count]) => (
                          <div key={province} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{province}</span>
                            <span className="font-medium">{count}</span>
                        </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">By District</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(feedbackStats.byDistrict).map(([district, count]) => (
                          <div key={district} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{district}</span>
                            <span className="font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Complaint Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <DialogTitle>Complaint Details - {selectedComplaint.trackingCode}</DialogTitle>
                <DialogDescription>
                  Submitted on {formatDate(selectedComplaint.postingDate)}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div>
                  <Label className="text-gray-500">Complaint Type</Label>
                  <p className="font-medium">{selectedComplaint.complaintType}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Contact</Label>
                  <p className="font-medium">{selectedComplaint.citizenPhone}</p>
                </div>
                <div>
                  <Label className="text-gray-500">ID/Email</Label>
                  <p className="font-medium">{selectedComplaint.citizenEmail}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Location</Label>
                  <p className="font-medium">{selectedComplaint.citizenDistrict}, {selectedComplaint.citizenSector}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-gray-500">Description</Label>
                  <p className="font-medium">{selectedComplaint.complaint}</p>
                </div>
                
                <div className="md:col-span-2 border-t pt-4">
                  <Label htmlFor="status">Update Status</Label>
                  <Select 
                    value={newStatus} 
                    onValueChange={(value: Status) => setNewStatus(value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Submitted">Submitted</SelectItem>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="response">Official Response</Label>
                  <Textarea
                    id="response"
                    placeholder="Enter your response to the citizen"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows={4}
                    className="mt-1"
                  />
                </div>

                {selectedComplaint.response && (
                  <div className="md:col-span-2">
                    <Label className="text-gray-500">Previous Response</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-600">
                        {selectedComplaint.adminResponder && (
                          <span className="font-medium">By {selectedComplaint.adminResponder} on {formatDate(selectedComplaint.responseDate || '')}</span>
                        )}
                      </p>
                      <p className="mt-2">{selectedComplaint.response}</p>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateStatus}
                  disabled={isSubmitting || !newStatus}
                  className="bg-green-500 hover:bg-green-600"
                >
                  {isSubmitting ? "Updating..." : "Update Complaint"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
