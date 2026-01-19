import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, ArrowLeft } from "lucide-react";
import logo from "../../assets/logo.png";
import api from "../../services/api";

function Header({ handleAlert, showBackButton = false }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post(`/api/auth/logout`, {});
      navigate("/login");
      handleAlert("Logged out successfully.", "success");
    } catch (error) {
      console.error('Logout error:', error);
      handleAlert("Error logging out. Please try again.", "danger");
    }
  };

  const handleBackToNotes = () => {
    navigate("/notes");
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center -space-x-12">
              <div className="p-1 rounded-lg">
                <img src={logo} alt="Luminote logo" className="h-12 w-32 object-contain" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Luminote</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <button
                onClick={handleBackToNotes}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ArrowLeft className="mr-2" size={18} />
                Back to Notes
              </button>
            )}
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <LogOut className="mr-2" size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;