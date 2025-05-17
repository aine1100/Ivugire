import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Flag,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useState } from "react";

interface AdminSidebarProps {
  open: boolean;
}

const AdminSidebar = ({ open }: AdminSidebarProps) => {
  const location = useLocation();
  const [dashboardOpen, setDashboardOpen] = useState(true);

  // Submodules for Dashboard
  const submodules = [
    {
      title: "Complaints",
      path: "/admin/dashboard?tab=complaints",
      icon: <Flag className="w-4 h-4 mr-2" />
    },
    {
      title: "Feedback",
      path: "/admin/dashboard?tab=feedback",
      icon: <MessageSquare className="w-4 h-4 mr-2" />
    }
  ];

  const isActive = (path: string) => {
    const basePath = path.split('?')[0];
    const currentPath = location.pathname;
    if (path.includes('?tab=')) {
      const tabParam = new URLSearchParams(path.split('?')[1]).get('tab');
      const searchParams = new URLSearchParams(location.search);
      const currentTab = searchParams.get('tab');
      return currentPath === basePath && (!currentTab || currentTab === tabParam);
    }
    return currentPath === basePath && !location.search;
  };

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-xl transition-all transform duration-300 ease-in-out z-10 ${
        open ? "translate-x-0 w-64" : "-translate-x-full w-0"
      } md:translate-x-0 ${open ? "md:w-64" : "md:w-0"}`}
    >
      <nav className="py-4 h-full overflow-y-auto flex flex-col">
        <div className="px-6 mb-8">
          <h2 className="text-xl font-bold text-green-600 tracking-tight">Admin Panel</h2>
        </div>
        {/* Main Board: Dashboard */}
        <div className="mb-2 px-3">
          <button
            className={`flex items-center w-full px-6 py-2 rounded-lg font-semibold text-lg transition-colors ${
              isActive("/admin/dashboard") || location.pathname === "/admin/dashboard"
                ? "bg-green-500 text-white shadow"
                : "text-gray-800 hover:bg-green-50"
            }`}
            onClick={() => setDashboardOpen((prev) => !prev)}
            aria-expanded={dashboardOpen === true}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
            {dashboardOpen ? (
              <ChevronUp className="ml-auto w-4 h-4" />
            ) : (
              <ChevronDown className="ml-auto w-4 h-4" />
            )}
          </button>
          {/* Submodules */}
          {dashboardOpen && (
            <div className="ml-8 mt-2 space-y-1 border-l-2 border-green-100 pl-4">
              {submodules.map((item) => (
                <Link
                  key={item.title}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-base transition-colors ${
                    isActive(item.path)
                      ? "bg-green-100 text-green-700 font-semibold"
                      : "text-gray-700 hover:bg-green-50"
                  }`}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="flex-grow" />
        <div className="px-6 pb-6 border-t pt-4">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
              A
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
