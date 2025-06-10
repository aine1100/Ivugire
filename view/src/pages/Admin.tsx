import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { getAllComplaints, getAllFeedback } from "@/api/adminApi";
import axios from "axios";
import { queryClient } from "../lib/queryClient";

const API_BASE_URL = import.meta.env.VITE_LOCATIONS_URL;

type Status = "Resolved" | "Rejected" | "Pending";

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

interface RawFeedback {
  _id: string;
  feedback?: string;
  citizenProvince?: string;
  citizenDistrict?: string;
  citizenSector?: string;
  citizenCell?: string;
  citizenVillage?: string;
  citizenEmail?: string;
  citizenPhone?: string;
  __v?: number;
}

interface Feedback {
  _id: string;
  feedback: string;
  citizenProvince?: string;
  citizenDistrict?: string;
  citizenSector?: string;
  citizenCell?: string;
  citizenVillage?: string;
  citizenEmail?: string;
  citizenPhone?: string;
  __v?: number;
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
    status: "all" as "all" | Status | "Pending",
    category: "all",
    district: "all",
    province: "all"
  });
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [responseText, setResponseText] = useState("");
  const [newStatus, setNewStatus] = useState<Status>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [statusCounts, setStatusCounts] = useState<Record<Status, number>>({
    "Resolved": 0,
    "Rejected": 0,
    "Pending": 0,
  });
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [provinceStats, setProvinceStats] = useState<Record<string, ProvinceStats>>({});
  const [districtStats, setDistrictStats] = useState<Record<string, {
    total: number;
    byStatus: Record<Status, number>;
  }>>({});
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

  // Queries
  const { data: complaintsData = [], isLoading: isLoadingComplaints, error: complaintsError } = useQuery({
    queryKey: ['complaints'],
    queryFn: getAllComplaints,
    select: (data) => data.map((complaint: Complaint) => ({
      ...complaint,
      status: complaint.status as Status
    }))
  });

  const { data: feedbackData = [], isLoading: isLoadingFeedback, error: feedbackError } = useQuery({
    queryKey: ['feedback'],
    queryFn: getAllFeedback,
    select: (data: RawFeedback[]) => data.map((item) => ({
      _id: item._id,
      feedback: item.feedback || '',
      citizenProvince: item.citizenProvince,
      citizenDistrict: item.citizenDistrict,
      citizenSector: item.citizenSector,
      citizenCell: item.citizenCell,
      citizenVillage: item.citizenVillage,
      citizenEmail: item.citizenEmail,
      citizenPhone: item.citizenPhone,
      __v: item.__v
    })) as Feedback[]
  });

  // Tabs from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    setCurrentView(tab || "dashboard");
  }, [location.search]);

  // Status counts for dashboard
  useEffect(() => {
    if (!complaintsData) return;
    const rawStatusCounts: Record<Status, number> = {
     
      "Resolved": 0,
      "Rejected": 0,
      "Pending": 0,
    };
    complaintsData.forEach((complaint) => {
      if (complaint.status in rawStatusCounts) {
        rawStatusCounts[complaint.status]++;
      }
    });
    setStatusCounts(rawStatusCounts);
  }, [complaintsData]);

  // Filtering
  useEffect(() => {
    if (!complaintsData) return;
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
      results = results.filter(complaint => {
        if (filters.status === 'Pending') {
          return  complaint.status === 'Pending';
        } else {
          return complaint.status === filters.status;
        }
      });
    }
    if (filters.category !== "all") {
      results = results.filter(complaint => complaint.complaintType === filters.category);
    }
    setFilteredComplaints(results);

    // Province stats for filtered
    const provinceData: Record<string, ProvinceStats> = {};
    results.forEach((complaint) => {
      if (!provinceData[complaint.citizenProvince]) {
        provinceData[complaint.citizenProvince] = {
          total: 0,
          byStatus: {  "Resolved": 0, "Rejected": 0, "Pending": 0 },
          districts: {}
        };
      }
      if (!provinceData[complaint.citizenProvince].districts[complaint.citizenDistrict]) {
        provinceData[complaint.citizenProvince].districts[complaint.citizenDistrict] = {
          total: 0,
          byStatus: {  "Resolved": 0, "Rejected": 0, "Pending": 0 }
        };
      }
      provinceData[complaint.citizenProvince].total++;
      provinceData[complaint.citizenProvince].byStatus[complaint.status]++;
      provinceData[complaint.citizenProvince].districts[complaint.citizenDistrict].total++;
      provinceData[complaint.citizenProvince].districts[complaint.citizenDistrict].byStatus[complaint.status]++;
    });
    setProvinceStats(provinceData);

    // Category stats
    const categoryData: Record<string, number> = {};
    results.forEach((complaint) => {
      categoryData[complaint.complaintType] = (categoryData[complaint.complaintType] || 0) + 1;
    });
    setCategoryCounts(categoryData);
  }, [complaintsData, filters]);

  // Fetch provinces/districts for filters
  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoading(prev => ({ ...prev, provinces: true }));
      try {
        const response = await fetch(`${API_BASE_URL}/provinces`);
        const data = await response.json();
        if (data.status === "success" && data.provinces) {
          setLocations(prev => ({ ...prev, provinces: data.provinces || [] }));
        }
      } finally {
        setIsLoading(prev => ({ ...prev, provinces: false }));
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!filters.province || filters.province === "all") {
        setLocations(prev => ({ ...prev, districts: [] }));
        return;
      }
      setIsLoading(prev => ({ ...prev, districts: true }));
      try {
        const encodedProvince = encodeURIComponent(filters.province);
        const response = await fetch(`${API_BASE_URL}/province/${encodedProvince}/districts`);
        const data = await response.json();
        if (data.status === "success" && data.districts) {
          setLocations(prev => ({ ...prev, districts: data.districts || [] }));
        }
      } finally {
        setIsLoading(prev => ({ ...prev, districts: false }));
      }
    };
    fetchDistricts();
  }, [filters.province]);

  // Feedback stats
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }).format(date);
    } catch {
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
      await axios.put(
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
      await queryClient.invalidateQueries({ queryKey: ['complaints'] });
      toast({
        title: "Success",
        description: "Complaint updated successfully",
      });
      setIsDialogOpen(false);
      setResponseText("");
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update complaint",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Chart data
  const statusChartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
    color:
      status === "Resolved" ? "#10b981" :
      status==="Rejected"?"#ef4444":
      status === "Pending" ? "#ffc107" :
      "#ef4444"
      
  }));

  // Tab switch
  const switchTab = (tab: string) => {
    setCurrentView(tab);
    navigate(`/admin/dashboard${tab !== 'dashboard' ? `?tab=${tab}` : ''}`);
  };

  // Complaints tab
  const renderComplaintsTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          placeholder="Search"
          value={filters.searchTerm}
          onChange={handleSearchChange}
          className="w-full"
        />
        <Select
          value={filters.province}
          onValueChange={(value) => setFilters(prev => ({ ...prev, province: value, district: "all" }))}
          disabled={isLoading.provinces}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Province" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Provinces</SelectItem>
            {locations.provinces.map((province) => (
              <SelectItem key={province} value={province}>{province}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.district}
          onValueChange={(value) => handleFilterChange("district", value)}
          disabled={filters.province === "all" || isLoading.districts}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select District" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Districts</SelectItem>
            {locations.districts.map((district) => (
              <SelectItem key={district} value={district}>{district}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>

            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-auto rounded-md border">
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
                <TableCell colSpan={7} className="text-center py-4 text-gray-500 text-sm">
                  No complaints found matching your filters
                </TableCell>
              </TableRow>
            ) : (
              filteredComplaints.map((complaint) => (
                <TableRow key={complaint._id}>
                  <TableCell>{complaint.trackingCode}</TableCell>
                  <TableCell>{complaint.complaintType}</TableCell>
                  <TableCell><StatusBadge status={complaint.status} /></TableCell>
                  <TableCell>{formatDate(complaint.postingDate)}</TableCell>
                  <TableCell>{complaint.citizenDistrict}, {complaint.citizenSector}</TableCell>
                  <TableCell>
                    <div>
                      <div>{complaint.citizenEmail}</div>
                      <div className="text-gray-500">{complaint.citizenPhone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(complaint)}>
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  if (isLoadingComplaints || isLoadingFeedback) {
    return <div className="text-center py-10">Loading...</div>;
  }
  if (complaintsError || feedbackError) {
    return <div className="text-center py-10 text-red-500">Error loading data</div>;
  }

  return (
    <div className="max-w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Citizen Engagement System</h1>
        <div className="text-xs sm:text-sm text-gray-500">
          Staff: Admin User | Role: Administrator
        </div>
      </div>
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border shadow-sm">
          <CardContent className="p-4 flex items-center">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3 sm:mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">Total Complaints</p>
              <p className="text-2xl sm:text-3xl font-bold">{complaintsData?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-4 flex items-center">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mr-3 sm:mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl sm:text-3xl font-bold">{statusCounts["Pending"]}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="p-4 flex items-center">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">Resolved</p>
              <p className="text-2xl sm:text-3xl font-bold">{statusCounts["Resolved"]}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-4 flex items-center">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 mr-3 sm:mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 0v7.5a3.75 3.75 0 003.75 3.75h1.5A3.75 3.75 0 0021 15.75v-7.5" />
              </svg>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">Total Feedback</p>
              <p className="text-2xl sm:text-3xl font-bold">{feedbackStats.total}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Tabs */}
      <Tabs value={currentView} className="w-full" onValueChange={switchTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg">Recent Complaints</CardTitle>
              <CardDescription className="text-sm font-semibold text-gray-600">Latest complaints from citizens</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tracking Code</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complaintsData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-sm text-gray-600">
                          No complaints found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      complaintsData.slice(0, 5).map((complaint) => (
                        <TableRow key={complaint._id}>
                          <TableCell>{complaint.trackingCode}</TableCell>
                          <TableCell>{complaint.complaintType}</TableCell>
                          <TableCell><StatusBadge status={complaint.status} /></TableCell>
                          <TableCell>{formatDate(complaint.postingDate)}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(complaint)}>
                              View Details
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Complaints by Category</CardTitle>
                <CardDescription className="text-sm font-semibold text-gray-600">
                  Distribution of complaints by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] sm:h-[300px] lg:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={Object.entries(categoryCounts).map(([category, count]) => ({
                        category,
                        count
                      }))}
                      margin={{ top: 20, right: 10, left: 10, bottom: 60 }}
                    >
                      <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} interval={0} tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <RechartsTooltip />
                      <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg font-semibold">Status Distribution</CardTitle>
                <CardDescription className="text-sm font-semibold text-gray-600">
                  Current status distribution of all complaints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] sm:h-[300px] lg:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
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
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        {/* Complaints Tab */}
        <TabsContent value="complaints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Complaints Management</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Manage and respond to complaints from citizens</CardDescription>
            </CardHeader>
            <CardContent>
              {renderComplaintsTab()}
            </CardContent>
          </Card>
        </TabsContent>
        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Citizen Feedback</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Review feedback submitted by citizens</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Feedback</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Contact</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feedbackData.map((item: Feedback) => (
                        <TableRow key={item._id}>
                          <TableCell className="max-w-[150px] sm:max-w-md text-xs sm:text-sm">
                            <p className="truncate">{item.feedback}</p>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs sm:text-sm">
                              <div>{item.citizenProvince}</div>
                              <div className="text-gray-500">{item.citizenDistrict}, {item.citizenSector}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs sm:text-sm">
                              <div>{item.citizenEmail}</div>
                              <div className="text-gray-500">{item.citizenPhone}</div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg">Total Feedback</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl sm:text-3xl font-bold">{feedbackStats.total}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg">By Province</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {Object.entries(feedbackStats.byProvince).map(([province, count]) => (
                          <div key={province} className="flex justify-between items-center">
                            <span className="text-xs sm:text-sm text-gray-600">{province}</span>
                            <span className="font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg">By District</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {Object.entries(feedbackStats.byDistrict).map(([district, count]) => (
                          <div key={district} className="flex justify-between items-center">
                            <span className="text-xs sm:text-sm text-gray-600">{district}</span>
                            <span className="font-semibold">{count}</span>
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
        <DialogContent className="max-w-[100vw] p-10 sm:max-w-2xl md:max-w-3xl w-full">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <DialogTitle className="text-sm sm:text-lg font-medium">
                  Complaint Details - {selectedComplaint.trackingCode}
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-gray-500">
                  Submitted on {formatDate(selectedComplaint.postingDate)}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 py-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <Label className="text-xs sm:text-sm font-semibold text-gray-500">Complaint Type</Label>
                  <p className="font-medium text-sm sm:text-base">{selectedComplaint.complaintType}</p>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm font-semibold text-gray-500">Contact</Label>
                  <p className="font-medium text-sm sm:text-base">{selectedComplaint.citizenPhone}</p>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm font-semibold text-gray-500">ID/Email</Label>
                  <p className="font-medium text-sm sm:text-base">{selectedComplaint.citizenEmail}</p>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm font-semibold text-gray-500">Location</Label>
                  <p className="font-medium text-sm sm:text-base">{selectedComplaint.citizenDistrict}, {selectedComplaint.citizenSector}</p>
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs sm:text-sm font-semibold text-gray-600">Description</Label>
                  <p className="font-medium text-sm sm:text-base">{selectedComplaint.complaint}</p>
                </div>
                <div className="sm:col-span-2 border-t pt-4">
                  <Label htmlFor="status" className="text-xs sm:text-sm">Update Status</Label>
                  <Select value={newStatus} onValueChange={(value: Status) => setNewStatus(value)}>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Submitted">Submitted</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="response" className="text-xs sm:text-sm">Official Response</Label>
                  <Textarea
                    id="response"
                    placeholder="Enter your response to the citizen"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows={4}
                    className="mt-1 w-full"
                  />
                </div>
                {selectedComplaint.response && (
                  <div className="sm:col-span-2">
                    <Label className="text-gray-600 text-xs sm:text-sm font-semibold">Previous Response</Label>
                    <div className="mt-2 p-3 bg-gray-100 rounded">
                      <p className="text-gray-600 text-xs sm:text-sm">
                        {selectedComplaint.adminResponder && (
                          <span className="font-semibold">By {selectedComplaint.adminResponder} on {formatDate(selectedComplaint.responseDate || '')}</span>
                        )}
                      </p>
                      <p className="mt-2 text-sm">{selectedComplaint.response}</p>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleUpdateStatus}
                  disabled={isSubmitting || !newStatus || selectedComplaint?.status === 'Resolved'}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? "Updating..." : "Submit Update"}
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