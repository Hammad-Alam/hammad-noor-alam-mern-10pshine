import axios from 'axios';

const API_URL = process.env.API_BASE_URL || "http://localhost:5000";

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This ensures cookies are included in requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to include credentials
api.interceptors.request.use(
  (config) => {
    // Ensure withCredentials is set for all requests
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;