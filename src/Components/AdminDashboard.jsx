import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaNotesMedical, FaStethoscope, FaLightbulb } from "react-icons/fa";

const AdminDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [description, setDescription] = useState("");
  const [keyword, setKeyword] = useState("");
  const [message, setMessage] = useState("");
  const [view, setView] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [advices, setAdvices] = useState([]); 

  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
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
        {
          symptomKeyword: keyword,
          adviceText: description
        },
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

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="container mt-5 bg-light min-vh-100 p-4">
      <h2 className="text-center text-purple mb-4">Admin Dashboard</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="row g-4 justify-content-center">
        <div className="col-md-3">
          <div className="card text-center shadow border-0 h-100" style={{ cursor: 'pointer' }} onClick={() => setView('addAdvice')}>
            <div className="card-body">
              <FaNotesMedical size={40} className="text-purple mb-2" />
              <h5 className="card-title">Add Advice</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center shadow border-0 h-100" style={{ cursor: 'pointer' }} onClick={fetchPatients}>
            <div className="card-body">
              <FaUser size={40} className="text-purple mb-2" />
              <h5 className="card-title">View Patients</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center shadow border-0 h-100" style={{ cursor: 'pointer' }} onClick={fetchSymptoms}>
            <div className="card-body">
              <FaStethoscope size={40} className="text-purple mb-2" />
              <h5 className="card-title">View Symptoms</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center shadow border-0 h-100" style={{ cursor: 'pointer' }} onClick={fetchAdvices}>
            <div className="card-body">
              <FaLightbulb size={40} className="text-warning mb-2" />
              <h5 className="card-title">View Advices</h5>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        {view === 'addAdvice' && (
  <div className="d-flex justify-content-center mt-4">
    <div className="card shadow p-4 w-100" style={{ maxWidth: "500px", borderRadius: "15px" }}>
      <h4 className="text-center mb-4" style={{ color: "purple" }}>Add New Advice</h4>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Keyword"
          className="form-control"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <textarea
          placeholder="Description"
          className="form-control"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <button className="btn btn-primary w-100" onClick={addAdvice}>
        Submit Advice
      </button>
    </div>
  </div>
)}


        {view === 'patients' && (
          <div className="card p-4 shadow border-0">
            <h4 className="text-purple mb-3">All Patients</h4>
            <ul className="list-group">
              {patients.map((p) => (
                <li className="list-group-item d-flex justify-content-between align-items-center" key={p.id}>
                  <span>
                    <strong>ID:</strong> {p.id} <strong>Name:</strong> {p.fullName}
                  </span>
                  <button className="btn btn-danger btn-sm" onClick={() => deletePatient(p.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {view === 'symptoms' && (
          <div className="card p-4 shadow border-0">
            <h4 className="text-purple mb-3">All Symptoms</h4>
            <ul className="list-group">
              {symptoms.map(symptom => (
                <li key={symptom.id} className="list-group-item">
                  <strong>Patient ID:</strong> {symptom.patientId}<br />
                  <strong>Description:</strong> {symptom.description}
                </li>
              ))}
            </ul>
          </div>
        )}

        {view === 'advices' && (
          <div className="card p-4 shadow border-0">
            <h4 className="text-purple mb-3">All Advices</h4>
            <ul className="list-group">
              {advices.map(advice => (
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
  );
};

export default AdminDashboard;
