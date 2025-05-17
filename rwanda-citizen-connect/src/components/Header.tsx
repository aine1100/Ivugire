
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Globe } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState("kinyarwanda"); // Default to Kinyarwanda

  const toggleLanguage = () => {
    setLanguage(language === "kinyarwanda" ? "english" : "kinyarwanda");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-24 w-24  rounded-full flex items-center justify-center">
              <img src="ivugire.svg" alt="Logo"
                      className="object-cover h-full w-full"/>
              </div>
              <span className="font-bold text-xl text-gray-800">Ivugire</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-green-600 font-medium">
              {language === "kinyarwanda" ? "Ahabanza" : "Home"}
            </Link>
            <Link to="/submit" className="text-gray-700 hover:text-green-600 font-medium">
              {language === "kinyarwanda" ? "Tanga Ikibazo" : "Submit Complaint"}
            </Link>
            <Link to="/track" className="text-gray-700 hover:text-green-600 font-medium">
              {language === "kinyarwanda" ? "Kureba Ikibazo" : "Track Complaint"}
            </Link>
            <Link to="/admin">
              <Button variant="outline" className="shadow-sm border-gray-200">
                {language === "kinyarwanda" ? "Kwinjira" : "Staff Login"}
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={toggleLanguage}
              className="flex items-center gap-2 shadow-sm border-gray-200"
            >
              <Globe className="h-4 w-4" />
              {language === "kinyarwanda" ? "English" : "Kinyarwanda"}
            </Button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                {language === "kinyarwanda" ? "Ahabanza" : "Home"}
              </Link>
              <Link
                to="/submit"
                className="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                {language === "kinyarwanda" ? "Tanga Ikibazo" : "Submit Complaint"}
              </Link>
              <Link
                to="/track"
                className="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                {language === "kinyarwanda" ? "Kureba Ikibazo" : "Track Complaint"}
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button variant="outline" className="w-full justify-start shadow-sm border-gray-200">
                  {language === "kinyarwanda" ? "Kwinjira" : "Staff Login"}
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 justify-start shadow-sm border-gray-200"
                onClick={() => {
                  toggleLanguage();
                  setMobileMenuOpen(false);
                }}
              >
                <Globe className="h-4 w-4" />
                {language === "kinyarwanda" ? "English" : "Kinyarwanda"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
