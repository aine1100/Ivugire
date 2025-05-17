
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useComplaints, Complaint } from "@/context/ComplaintContext";
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

const Admin = () => {
  const { complaints, updateComplaintStatus } = useComplaints();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [filters, setFilters] = useState({
    searchTerm: "",
    status: "all",
    category: "all",
    district: "all",
  });
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [responseText, setResponseText] = useState("");
  const [newStatus, setNewStatus] = useState<Complaint["status"]>("Submitted");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [currentView, setCurrentView] = useState("dashboard");
  
  // Mock feedback data
  const [feedbackItems] = useState([
    { id: 1, text: "Urubuga rwiza cyane kandi rwihuse, murakoze!", date: "2023-05-15T14:30:00" },
    { id: 2, text: "Nabonye igisubizo ku kibazo cyanjye vuba, murakoze!", date: "2023-05-14T09:22:00" },
    { id: 3, text: "Igihe cyo gutegereza ni kirekire, mushobora kucyihutisha?", date: "2023-05-13T16:45:00" },
    { id: 4, text: "Mfite ikibazo cyo kwiyandikisha kuri iyi serivisi.", date: "2023-05-12T11:05:00" },
    { id: 5, text: "Système irakora neza cyane n'ubundi murakoze.", date: "2023-05-11T08:30:00" },
  ]);

  // Charts data
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [districtData, setDistrictData] = useState<Record<string, number>>({});

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

  useEffect(() => {
    // Apply filters to complaints
    let results = [...complaints];

    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      results = results.filter(
        (complaint) =>
          complaint.fullName.toLowerCase().includes(term) ||
          complaint.id.toLowerCase().includes(term) ||
          complaint.description.toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (filters.status !== "all") {
      results = results.filter(
        (complaint) => complaint.status === filters.status
      );
    }

    // Filter by category
    if (filters.category !== "all") {
      results = results.filter(
        (complaint) => complaint.category === filters.category
      );
    }

    // Filter by district
    if (filters.district !== "all") {
      results = results.filter(
        (complaint) => complaint.district === filters.district
      );
    }

    // Apply tab filter
    if (activeTab !== "all") {
      results = results.filter((complaint) => complaint.status === activeTab);
    }

    setFilteredComplaints(results);

    // Calculate stats for charts
    const statusData: Record<string, number> = {};
    const categoryData: Record<string, number> = {};
    const districtStats: Record<string, number> = {};

    complaints.forEach((complaint) => {
      // Count by status
      statusData[complaint.status] = (statusData[complaint.status] || 0) + 1;
      
      // Count by category
      categoryData[complaint.category] = (categoryData[complaint.category] || 0) + 1;
      
      // Count by district
      districtStats[complaint.district] = (districtStats[complaint.district] || 0) + 1;
    });

    setStatusCounts(statusData);
    setCategoryCounts(categoryData);
    setDistrictData(districtStats);
  }, [complaints, filters, activeTab]);

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

  const handleUpdateStatus = () => {
    if (!selectedComplaint) return;
    
    setIsSubmitting(true);
    
    try {
      updateComplaintStatus(selectedComplaint.id, newStatus, responseText);
      
      toast({
        title: "Status Updated",
        description: `Complaint ${selectedComplaint.id} has been updated to ${newStatus}`,
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Update Error",
        description: "Failed to update complaint status",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusCount = (status: string) => {
    return complaints.filter(complaint => complaint.status === status).length;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

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
  const categories = Array.from(new Set(complaints.map(c => c.category)));
  const districts = Array.from(new Set(complaints.map(c => c.district)));

  const switchTab = (tab: string) => {
    setCurrentView(tab);
    navigate(`/admin/dashboard${tab !== 'dashboard' ? `?tab=${tab}` : ''}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Citizen Engagement System</h1>
        <div className="text-sm text-gray-500">
          Staff: Admin User | Role: Administrator
        </div>
      </div>

      {/* Stats cards designed like the reference image */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border shadow-sm">
          <CardContent className="p-4 flex items-center">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Complaints</p>
              <p className="text-3xl font-bold">{complaints.length}</p>
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
              <p className="text-3xl font-bold">{getStatusCount("Submitted") + getStatusCount("Under Review")}</p>
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
                    {complaints.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                          No complaints found
                        </TableCell>
                      </TableRow>
                    ) : (
                      complaints.slice(0, 5).map((complaint) => (
                        <TableRow key={complaint.id}>
                          <TableCell className="font-medium">{complaint.id}</TableCell>
                          <TableCell>{complaint.category}</TableCell>
                          <TableCell>
                            <StatusBadge status={complaint.status} />
                          </TableCell>
                          <TableCell>{formatDate(complaint.createdAt)}</TableCell>
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
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <RechartsTooltip />
                        <Bar dataKey="value" fill="#22c55e" />
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
              <div className="space-y-4">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Input
                      placeholder="Search by ID or name"
                      value={filters.searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => handleFilterChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.district}
                    onValueChange={(value) => handleFilterChange("district", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by district" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Districts</SelectItem>
                      {districts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Complaints Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredComplaints.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                            No complaints found matching your filters
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredComplaints.map((complaint) => (
                          <TableRow key={complaint.id}>
                            <TableCell>{complaint.id}</TableCell>
                            <TableCell>{complaint.fullName}</TableCell>
                            <TableCell>{complaint.category}</TableCell>
                            <TableCell>{formatDate(complaint.createdAt)}</TableCell>
                            <TableCell>
                              <StatusBadge status={complaint.status} />
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
              </div>
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
              <div className="space-y-4">
                {feedbackItems.map((item) => (
                  <Card key={item.id} className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-gray-800">{item.text}</p>
                          <p className="text-xs text-gray-500">
                            Submitted on {formatDate(item.date)}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">Mark as Read</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <div className="flex justify-center">
                  <Button variant="outline">Load More Feedback</Button>
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
                <DialogTitle>Complaint Details - {selectedComplaint.id}</DialogTitle>
                <DialogDescription>
                  Submitted on {formatDate(selectedComplaint.createdAt)}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div>
                  <Label className="text-gray-500">Name</Label>
                  <p className="font-medium">{selectedComplaint.fullName}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Contact</Label>
                  <p className="font-medium">{selectedComplaint.phoneNumber}</p>
                </div>
                <div>
                  <Label className="text-gray-500">ID/Email</Label>
                  <p className="font-medium">{selectedComplaint.nationalIdOrEmail}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Location</Label>
                  <p className="font-medium">{selectedComplaint.district}, {selectedComplaint.sector}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Service Type</Label>
                  <p className="font-medium">{selectedComplaint.serviceType}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Category</Label>
                  <p className="font-medium">{selectedComplaint.category}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-gray-500">Description</Label>
                  <p className="font-medium">{selectedComplaint.description}</p>
                </div>
                
                <div className="md:col-span-2 border-t pt-4">
                  <Label htmlFor="status">Update Status</Label>
                  <Select 
                    value={newStatus} 
                    onValueChange={(value: Complaint["status"]) => setNewStatus(value)}
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
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateStatus}
                  disabled={isSubmitting}
                  className="bg-green-500 hover:bg-green-600"
                >
                  {isSubmitting ? "Updating..." : "Update Status"}
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
