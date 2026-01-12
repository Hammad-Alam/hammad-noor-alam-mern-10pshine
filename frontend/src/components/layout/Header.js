import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Pin } from "lucide-react";
import api from "../../services/api";

function Header({ handleAlert }) {
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

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">Notes App Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
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