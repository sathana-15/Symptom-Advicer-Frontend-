import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; 

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ROLE_PATIENT");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post("http://localhost:8080/api/auth/login", {
      email,
      password,
    });

    console.log("Login Response:", response.data);

    
    if (!response.data.patientId || response.data.patientId === 0) {
      console.warn("⚠️ Warning: patientId is missing or 0 in login response.");
    } else {
      console.log("✅ patientId received:", response.data.patientId);
    }

    
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("userId", response.data.patientId);  


   
    if (role === "ROLE_PATIENT") {
      navigate("/patient-dashboard");
    } else if (role === "ADMIN") {
      navigate("/admin-dashboard");
    } else {
      navigate("/doctor-dashboard");
    }
  } catch (error) {
    console.error("❌ Login failed:", error);

    if (error.response) {
      console.error("Server response:", error.response.data);
    }

    alert("Invalid credentials or user role mismatch.");
  }
};


  return (
    <div className="login-wrapper d-flex align-items-center justify-content-center vh-100 bg-purple-light">
      <div className="card p-4 shadow login-box">
        <h2 className="text-center text-purple app-title mb-4">Symptom Advicer Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label className="text-purple">Email:</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label className="text-purple">Password:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label className="text-purple">Role:</label>
            <select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="ROLE_PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn btn-purple w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
