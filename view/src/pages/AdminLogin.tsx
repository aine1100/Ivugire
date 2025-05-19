import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { login } from "@/api/authApi";

const AdminLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login(formData);
      if (response.success) {
        // Store the token in localStorage or your preferred storage method
        localStorage.setItem('token', response.token || '');
        toast({
          title: "Login Successful",
          description: "Welcome to the CES Admin Dashboard",
        });
        navigate("/admin/dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: response.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 flag-stripe">
      <div className="max-w-md w-full p-4 animate-fade-in">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="h-24 w-24 rounded-full flex items-center justify-center">
                <img src="ivugire.svg" alt="Logo" className="object-cover h-full w-full" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Staff Login</CardTitle>
            <CardDescription className="text-center">
              Login to access the Citizen Engagement System admin dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="admin@cesrwanda.gov.rw"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  aria-label="Remember me"
                />
                <Label htmlFor="remember">Remember me</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full bg-rwanda-blue hover:bg-rwanda-blue/90">
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
          <div className="text-center mt-4 mb-4 text-sm">
            <span className="text-gray-500">Test login: </span>
            <span className="text-gray-700">admin@cesrwanda.gov.rw / admin123</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
