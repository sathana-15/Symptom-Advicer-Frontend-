import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./RoleSelection.css"; 

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleClick = (role) => {
    if (role === "admin") {
      navigate("/admin-login");
    } else {
      navigate("/login", { state: { role } }); 
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <h2 className="mb-4 text-purple fw-bold">Choose Your Role</h2>
      <div className="d-flex gap-4">
        <button className="btn btn-purple fw-bold px-5 py-3" onClick={() => handleRoleClick("admin")}>
          Admin
        </button>
        <button className="btn btn-purple fw-bold px-5 py-3" onClick={() => handleRoleClick("doctor")}>
          Doctor
        </button>
        <button className="btn btn-purple fw-bold px-5 py-3" onClick={() => handleRoleClick("patient")}>
          Patient
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
