import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaUser,
  FaNotesMedical,
  FaStethoscope,
  FaLightbulb,
  FaTachometerAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [description, setDescription] = useState("");
  const [keyword, setKeyword] = useState("");
  const [message, setMessage] = useState("");
  const [view, setView] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [advices, setAdvices] = useState([]);
  const [editingPatient, setEditingPatient] = useState(null);
  const [editPatientData, setEditPatientData] = useState({});

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:8080/patient/patients", axiosConfig);
      setPatients(response.data);
      setView("patients");
    } catch (error) {
      console.error("Failed to fetch patients", error);
      if (error.response?.status === 403) {
        setMessage("Access denied. Admins only.");
      }
    }
  };

  const fetchSymptoms = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/symptoms", axiosConfig);
      setSymptoms(response.data);
      setView("symptoms");
    } catch (error) {
      console.error("Failed to fetch symptoms", error);
      if (error.response?.status === 403) {
        setMessage("Access denied to view symptoms.");
      }
    }
  };

  const fetchAdvices = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/advice", axiosConfig);
      setAdvices(response.data);
      setView("advices");
    } catch (error) {
      console.error("Failed to fetch advices", error);
      if (error.response?.status === 403) {
        setMessage("Access denied to view advices.");
      }
    }
  };

  const addAdvice = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/advice",
        { symptomKeyword: keyword, adviceText: description },
        axiosConfig
      );
      setMessage("Advice added successfully");
      setKeyword("");
      setDescription("");
    } catch (error) {
      console.error("Error adding advice", error);
      if (error.response?.status === 403) {
        setMessage("Access denied to add advice");
      } else {
        setMessage("Error adding advice. Please try again.");
      }
    }
  };

  const deletePatient = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/patient/patients/${id}`, axiosConfig);
      setMessage("Patient deleted successfully");
      fetchPatients();
    } catch (error) {
      console.error("Error deleting patient", error);
      if (error.response?.status === 403) {
        setMessage("You don't have permission to delete patient");
      }
    }
  };

  const updatePatient = async () => {
    try {
      await axios.put(
        `http://localhost:8080/patient/patients/${editingPatient.id}`,
        editPatientData,
        axiosConfig
      );
      setMessage("Patient updated successfully");
      setEditingPatient(null);
      fetchPatients();
    } catch (error) {
      console.error("Error updating patient", error);
      setMessage("Failed to update patient");
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="bg-light min-vh-100 pb-5">
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-3 fixed-top">
        <span className="navbar-brand text-purple fw-bold fs-3">Symptom Adviser</span>
        <div className="ms-auto d-flex align-items-center gap-3">
          <a href="/" className="nav-link text-purple fw-bold d-flex align-items-center">
            <FaTachometerAlt className="me-2" /> Dashboard
          </a>
          <button onClick={() => navigate("/login")} className="btn btn-purple text-white fw-bold px-3">
            Login
          </button>
          <button onClick={() => navigate("/signup")} className="btn btn-purple text-white fw-bold px-3">
            Sign Up
          </button>
        </div>
      </nav>

      <div className="container mt-5 pt-5 p-4">
        <h2 className="text-center text-purple mb-4"> 🛠️ Admin Dashboard</h2>
        {message && <div className="alert alert-info">{message}</div>}

        <div className="row g-4 justify-content-center">
          {[
            { icon: <FaNotesMedical />, label: "Add Advice", action: () => setView("addAdvice") },
            { icon: <FaUser />, label: "View Patients", action: fetchPatients },
            { icon: <FaStethoscope />, label: "View Symptoms", action: fetchSymptoms },
            { icon: <FaLightbulb />, label: "View Advices", action: fetchAdvices },
          ].map((item, index) => (
            <div className="col-md-3" key={index}>
              <div className="card text-center shadow border-0 h-100" style={{ cursor: "pointer" }} onClick={item.action}>
                <div className="card-body">
                  <div className="text-purple mb-2" style={{ fontSize: 40 }}>{item.icon}</div>
                  <h5 className="card-title">{item.label}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5">
          {view === "addAdvice" && (
            <div className="d-flex justify-content-center mt-4">
              <div className="card shadow p-4 w-100" style={{ maxWidth: "500px", borderRadius: "15px" }}>
                <h4 className="text-center mb-4" style={{ color: "purple" }}>Add New Advice</h4>
                <input type="text" className="form-control mb-3" placeholder="Keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                <textarea className="form-control mb-3" placeholder="Description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
                <button className="btn btn-primary w-100" onClick={addAdvice}>Submit Advice</button>
              </div>
            </div>
          )}

          {view === "patients" && (
  <div className="card p-4 shadow border-0">
    <h4 className="text-purple mb-3">All Patients</h4>
    <ul className="list-group">
      {patients.map((p) => (
        <li className="list-group-item" key={p.id}>
          {editingPatient?.id === p.id ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updatePatient();
              }}
            >
              <div className="row g-2">
                {Object.entries(editPatientData).map(([key, value]) => (
                  <div className="col-md-3" key={key}>
                    <label className="form-label text-capitalize">{key}</label>
                    <input
                      type={key === "password" ? "password" : key === "age" ? "number" : "text"}
                      className="form-control"
                      value={value}
                      onChange={(e) =>
                        setEditPatientData({ ...editPatientData, [key]: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 d-flex gap-2">
                <button type="submit" className="btn btn-success btn-sm">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setEditingPatient(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <p><strong>ID:</strong> {p.id}</p>
              <p><strong>Username:</strong> {p.username}</p>
              <p><strong>Email:</strong> {p.email}</p>
              <p><strong>Full Name:</strong> {p.fullName}</p>
              <p><strong>Gender:</strong> {p.gender}</p>
              <p><strong>Age:</strong> {p.age}</p>
              <p><strong>Phone:</strong> {p.phone}</p>
              <p><strong>Address:</strong> {p.address}</p>
              <p><strong>Roles:</strong> {p.roles}</p>
              <div className="d-flex gap-2 mt-2">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setEditingPatient(p);
                    setEditPatientData({ ...p });
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deletePatient(p.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  </div>
)}


          {view === "symptoms" && (
            <div className="card p-4 shadow border-0">
              <h4 className="text-purple mb-3">All Symptoms</h4>
              <ul className="list-group">
                {symptoms.map((symptom) => (
                  <li key={symptom.id} className="list-group-item">
                    <strong>Patient ID:</strong> {symptom.patientId}<br />
                    <strong>Description:</strong> {symptom.description}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {view === "advices" && (
            <div className="card p-4 shadow border-0">
              <h4 className="text-purple mb-3">All Advices</h4>
              <ul className="list-group">
                {advices.map((advice) => (
                  <li key={advice.id} className="list-group-item">
                    <strong>Keyword:</strong> {advice.keyword}<br />
                    <strong>Advice:</strong> {advice.adviceText}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
