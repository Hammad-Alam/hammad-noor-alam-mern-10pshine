import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import AuthCard from "../../components/common/AuthCard";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

function Login(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Get the redirect path from location state, default to '/notes'
  const from = location.state?.from?.pathname || "/notes";

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!credentials.email || !credentials.password) {
        props.handleAlert("Please fill in all fields.", "danger");
        setLoading(false);
        return;
      }

      // Validate password is not empty
      if (!credentials.password.trim()) {
        props.handleAlert("Password is required.", "danger");
        setLoading(false);
        return;
      }

      // Validate email format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(credentials.email)) {
        props.handleAlert("Please enter valid email format.", "danger");
        setLoading(false);
        return;
      }

      const result = await login(credentials);

      if (result.success) {
        setCredentials({
          email: "",
          password: "",
        });
        // Redirect to the originally requested page or default to notes
        navigate(from, { replace: true });
        props.handleAlert("Successfully logged in.", "success");
      } else {
        props.handleAlert(result.error, "danger");
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      props.handleAlert(errorMessage, "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Sign in to your account">
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            label="Email address"
            placeholder="Enter your email"
            value={credentials.email}
            onChange={handleChange}
          />

          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            label="Password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={handleChange}
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

        <div className="flex items-center justify-end">
          <div className="text-sm">
            <Link
              to="/forgot-password"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <Button
          text={loading ? "Signing in..." : "Sign in"}
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) {
              handleSubmit(e);
            }
          }}
        />

        <div className="text-center text-sm">
          <span className="text-gray-600">Don't have an account?</span>{" "}
          <Link
            to="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}

export default Login;
