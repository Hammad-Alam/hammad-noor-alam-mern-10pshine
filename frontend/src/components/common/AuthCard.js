import React from "react";
import logo from "../../assets/logo.png";

function AuthCard({ children, title }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <img src={logo} alt="Notes App logo" className="h-20 w-40" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </div>
  );
}

export default AuthCard;
