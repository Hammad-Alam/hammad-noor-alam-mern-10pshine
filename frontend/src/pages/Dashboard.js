import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import api from "../services/api";

function Dashboard(props) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post(`/api/auth/logout`, {});
      navigate("/login");
      props.handleAlert("Logged out successfully.", "success");
    } catch (error) {
      console.error('Logout error:', error);
      props.handleAlert("Error logging out. Please try again.", "danger");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Notes App Dashboard</h1>
            </div>
            <div className="flex items-center">
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

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <h2 className="text-2xl font-bold text-gray-700">Dashboard Coming Soon</h2>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;