import React, { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import AuthCard from "../../components/common/AuthCard";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function ForgotPassword(props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      props.handleAlert("Please enter valid email format.", "danger");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await api.post(
        `/api/auth/forgot-password`,
        { email }
      );
      
      if (response.status === 200) {
        props.handleAlert("OTP sent to your email. Please check your inbox.", "success");
        // Navigate to verify OTP page
        navigate("/verify-otp", { state: { email } });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send OTP. Please try again.";
      props.handleAlert(errorMessage, "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Reset your password">
      <div className="mt-2 text-center">
        <p className="text-sm text-gray-600">
          Enter your email address and we'll send you a verification code to reset your
          password.
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            label="Email address"
            icon={<Mail size={20} />}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <Button text={loading ? "Sending..." : "Send Verification Code"} disabled={loading} />

        <div className="text-center text-sm">
          <Link
            to="/login"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to login
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}

export default ForgotPassword;