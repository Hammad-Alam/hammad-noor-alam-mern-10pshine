import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Alert from "./components/common/Alert";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOTP from "./pages/auth/VerifyOTP";
import ResetPassword from "./pages/auth/ResetPassword";

import NotesDashboard from "./pages/notes/NotesDashboard";
import NoteEditor from "./pages/notes/NoteEditor";

function App() {
  const [alert, setAlert] = useState(null);

  const handleAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 2500);
  };

  return (
    <BrowserRouter>
      {alert && <Alert alert={alert} />}
      <Routes>
        <Route path="/" element={<Login handleAlert={handleAlert} />} />
        <Route path="/login" element={<Login handleAlert={handleAlert} />} />
        <Route path="/signup" element={<Signup handleAlert={handleAlert} />} />
        <Route path="/notes" element={<NotesDashboard handleAlert={handleAlert} />} />
        <Route path="/notes/create" element={<NoteEditor handleAlert={handleAlert} />} />
        <Route path="/notes/edit/:noteId" element={<NoteEditor handleAlert={handleAlert} />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword handleAlert={handleAlert} />}
        />
        <Route
          path="/verify-otp"
          element={<VerifyOTP handleAlert={handleAlert} />}
        />
        <Route
          path="/reset-password"
          element={<ResetPassword handleAlert={handleAlert} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
