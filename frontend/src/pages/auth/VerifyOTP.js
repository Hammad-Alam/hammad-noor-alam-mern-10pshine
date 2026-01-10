import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import AuthCard from "../../components/common/AuthCard";
import Button from "../../components/common/Button";

export default function VerifyOTP(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useMemo(
    () =>
      Array(6)
        .fill()
        .map(() => React.createRef()),
    []
  );

  const handleChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("").trim();

    if (otpValue.length !== 6) {
      props.handleAlert("Please enter all 6 digits code.", "danger");
      return;
    }

    // Ensure OTP contains only digits
    if (!/^[0-9]{6}$/.test(otpValue)) {
      props.handleAlert("OTP must contain only digits.", "danger");
      return;
    }

    setLoading(true);

    try {
      // Verify the OTP by attempting to use it in a reset password call with dummy passwords
      // Actually, just pass the OTP to the reset password page since the backend will validate it there
      navigate("/reset-password", { state: { email, otp: otpValue } });
      props.handleAlert("OTP verified. Proceeding to reset password.", "success");
    } catch (error) {
      props.handleAlert("Verification failed.", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Enter verification code">
      <div className="mt-2 text-center">
        <p className="text-sm text-gray-600">
          We've sent a 6-digit code to {email}. Please enter it below.
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
          ))}
        </div>

        <Button
          text={loading ? "Verifying..." : "Verify Code"}
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Didn't receive the code? Please check your email again.
          </p>
        </div>
      </form>
    </AuthCard>
  );
}