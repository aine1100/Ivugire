import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { logout } from "@/api/authApi";

interface AdminHeaderProps {
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
}

interface UserInfo {
  username: string;
  email: string;
  role?: string;
}

interface DecodedToken {
  username: string;
  email: string;
  role?: string;
  exp: number;
}

const AdminHeader = ({ setSidebarOpen, sidebarOpen }: AdminHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      if (location.pathname !== '/admin') {
        navigate('/admin');
      }
      return;
    }

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      
      // Check if token is expired
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        if (location.pathname !== '/admin') {
          navigate('/admin');
        }
        return;
      }

      setUserInfo({
        username: decodedToken.username || 'Admin User',
        email: decodedToken.email || 'admin@example.com',
        role: decodedToken.role || 'Administrator'
      });
    } catch (error) {
      console.error('Error decoding token:', error);
      localStorage.removeItem('token');
      if (location.pathname !== '/admin') {
        navigate('/admin');
      }
    }
  }, [navigate, location.pathname]);

  const handleLogout = () => {
   logout()
  };

  // Don't render header on login page
  if (location.pathname === '/admin') {
    return null;
  }

  return (
    <header className="bg-white shadow z-50 sticky top-0">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-4"
          >
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
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </Button>

          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white font-bold text-xl">I</span>
            </div>
            <div>
              <span className="font-bold text-xl text-green-600">Ivugire</span>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
