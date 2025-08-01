import React from 'react';
import './HomePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaNotesMedical, FaStethoscope, FaLightbulb, FaTachometerAlt } from "react-icons/fa";

const HomePage = () => {
  const navigate = useNavigate();

  const handleRoleClick = (role) => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="home-page bg-light-purple min-vh-100">
      
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-3">
        <span className="navbar-brand text-purple fw-bold fs-3">Symptom Adviser</span>

        <div className="ms-auto d-flex align-items-center gap-3">
          <a href="/" className="nav-link text-purple fw-bold d-flex align-items-center">
            <FaTachometerAlt className="me-2" /> Dashboard
          </a>
          <button onClick={() => navigate('/login')} className="btn btn-purple text-white fw-bold px-3">
            Login
          </button>
          <button onClick={() => navigate('/signup')} className="btn btn-purple text-white fw-bold px-3">
            Sign Up
          </button>
        </div>
      </nav>

    
      <div className="container mt-5">
        <div className="welcome-card shadow p-4 mb-4 rounded bg-white">
          <h2 className="text-purple fw-bold">👋 Hello! Welcome Back</h2>
          <p className="text-muted">Feeling unwell? Submit your symptoms and get trusted advice.</p>
        </div>

      
        <div className="row g-4 mb-4">
          <DashboardBox title="Advices" count="15" icon="📝" />
          <DashboardBox title="Symptoms" count="25" icon={<WhiteIcon icon="🩺" />} />
          <DashboardBox title="Patients" count="10" icon={<WhiteIcon icon="👤" />} />
          <DashboardBox title="Doctors" count="4" icon={<WhiteIcon icon="🧑‍⚕️" />} />
        </div>

   
        <div className="row g-4 mb-5">
          <RoleBox role="Admin" icon="🛠️" onClick={() => handleRoleClick('admin')} />
          <RoleBox role="Doctor" icon="🧑‍⚕️" onClick={() => handleRoleClick('doctor')} />
          <RoleBox role="Patient" icon="🏥" onClick={() => handleRoleClick('patient')} />
        </div>
      </div>

    
      <style>
        {`
          .text-purple {
            color: #6f42c1 !important;
          }
          .bg-purple {
            background-color: #6f42c1 !important;
          }
          .btn-purple {
            background-color: #6f42c1;
            color: white;
            border: none;
          }
          .btn-purple:hover {
            background-color: #5a32a3;
            color: white;
          }
          .icon-circle,
          .icon-circle-white {
            width: 50px;
            height: 50px;
            line-height: 50px;
            border-radius: 50%;
            display: inline-block;
            font-size: 1.5rem;
          }
          .box-card {
            padding: 20px;
            border-radius: 12px;
            transition: all 0.3s ease-in-out;
          }

          .role-box {
            transition: all 0.3s ease-in-out;
            border-left: 5px solid #6f42c2 !important;
            padding: 12px 16px;
            border-radius: 8px;
            background-color: white;
          } 

          .role-box:hover {
            transform: scale(1.03);
            border-left: 5px solid #6f42c1 !important;
            box-shadow: 0 8px 16px rgba(128, 82, 215, 0.2);
            background-color: #fdf9ff;
          }

          .bg-light-purple {
            background-color: #f8f0fc;
          }
        `}
      </style>
    </div>
  );
};

const DashboardBox = ({ title, count, icon }) => (
  <div className="col-md-3 col-sm-6">
    <div className="card text-center shadow-sm border-0 box-card rounded-4">
      <div className="card-body">
        <div className="icon-circle bg-purple text-white mb-3">{icon}</div>
        <h3 className="text-purple fw-bold">{count}</h3>
        <p className="text-muted">{title}</p>
      </div>
    </div>
  </div>
);

const RoleBox = ({ role, icon, onClick }) => (
  <div className="col-md-4 col-sm-6">
    <div className="card text-center shadow-sm border-0 box-card role-box rounded-4" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="card-body">
        <div className="icon-circle-white bg-purple text-white mb-3">{icon}</div>
        <h5 className="text-purple fw-bold">{role}</h5>
        <p className="text-muted">Login as {role.toLowerCase()}</p>
      </div>
    </div>
  </div>
);

const WhiteIcon = ({ icon }) => (
  <span style={{ color: 'white', fontSize: '1.5rem' }}>{icon}</span>
);

export default HomePage;
