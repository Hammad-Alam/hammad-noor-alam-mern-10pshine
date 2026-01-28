import React, { useState } from "react";
import { Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import AuthCard from "../../components/common/AuthCard";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

function ResetPassword(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, otp } = location.state || {};
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password format (8+ chars, uppercase, lowercase, numbers, and special character)
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordPattern.test(password)) {
      props.handleAlert(
        "Password should be at least 8 characters, contain uppercase, lowercase letters, numbers and special character.",
        "danger"
      );
      return;
    }
    
    if (password !== confirmPassword) {
      props.handleAlert("Passwords do not match.", "danger");
      return;
    }
    
    if (!email || !otp) {
      props.handleAlert("Missing email or OTP. Please start the process again.", "danger");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        `/api/auth/reset-password`,
        {
          email,
          otp, // Pass the OTP from location state
          newPassword: password,
          confirmPassword
        }
      );

      if (response.status === 200) {
        props.handleAlert("Password reset successful. You can now login.", "success");
        navigate("/login");
      }
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage =
        error.response?.data?.message || "Password reset failed. Please try again.";
      props.handleAlert(errorMessage, "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Create new password">
      <div className="mt-2 text-center">
        <p className="text-sm text-gray-600">
          Your new password must be different from previous passwords.
        </p>
      </div>
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              label="New password"
              icon={<Lock size={20} />}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              iconRight={
                showPassword ? (
                  <Eye
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                    size={20}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <EyeOff
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                    size={20}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )
              }
            />
          </div>

          <div className="relative">
            <Input
              id="confirm-password"
              name="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              required
              label="Confirm new password"
              icon={<Lock size={20} />}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              iconRight={
                showConfirmPassword ? (
                  <Eye
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                    size={20}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                ) : (
                  <EyeOff
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                    size={20}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                )
              }
            />
          </div>
        </div>

        <div className="space-y-4">
          <Button text={loading ? "Resetting..." : "Reset Password"} disabled={loading} />
        </div>
        
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

export default ResetPassword;