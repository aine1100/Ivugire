
import { Outlet, useLocation } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
        <div className="flex">
          <AdminSidebar open={sidebarOpen} />
          <main 
            className={`flex-1 p-4 md:p-6 transition-all ${sidebarOpen ? 'md:ml-64' : ''}`}
            onClick={() => {
              // Close sidebar on main content click on mobile
              if (window.innerWidth < 768 && sidebarOpen) {
                setSidebarOpen(false);
              }
            }}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AdminLayout;
