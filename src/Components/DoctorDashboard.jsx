import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DoctorDashboard.css';
import { FaTachometerAlt } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [advices, setAdvices] = useState([]);
  const [newAdvice, setNewAdvice] = useState({ symptomKeyword: '', adviceText: '' });
  const [message, setMessage] = useState('');
  const [view, setView] = useState('');

  const navigate = useNavigate(); 
  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchPatients();
    fetchSymptoms();
    fetchAdvices();
  }, []);

  async function fetchPatients() {
    try {
      const res = await axios.get('http://localhost:8080/patient/patients', authHeader);
      const onlyPatients = res.data.filter(user =>
        Array.isArray(user.roles)
          ? user.roles.includes("ROLE_PATIENT")
          : user.roles === "ROLE_PATIENT"
      );
      setPatients(onlyPatients);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  }

  async function fetchSymptoms() {
    try {
      const res = await axios.get('http://localhost:8080/api/symptoms', authHeader);
      setSymptoms(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching symptoms:', err);
    }
  }

  async function fetchAdvices() {
    try {
      const res = await axios.get('http://localhost:8080/api/advice', authHeader);
      setAdvices(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching advices:', err);
    }
  }

  async function handleAdviceSubmit(e) {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/advice', newAdvice, authHeader);
      setMessage('✅ Advice added successfully.');
      setNewAdvice({ symptomKeyword: '', adviceText: '' });
      fetchAdvices();
    } catch (err) {
      console.error('Error adding advice:', err);
      setMessage(
        err.response?.status === 405
          ? '❌ Invalid API method or wrong URL.'
          : '❌ Error adding advice.'
      );
    }
  }

  return (
    <div className="dashboard-background">

      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-3 fixed-top">
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

      <div className="container mt-4">
        <div className="container mt-5 pt-5 text-center">
          
          <h2 className="text-purple fw-bold mb-4">🩺 Doctor Dashboard</h2>
        </div>

        <div className="d-flex justify-content-around mb-4 flex-wrap gap-3">
          <div className="card text-center shadow" style={{ width: "200px", cursor: 'pointer' }} onClick={() => setView("add")}>
            <div className="card-body">
              <div className="fs-1">➕</div>
              <h5 className="card-title">Add Advice</h5>
            </div>
          </div>
          <div className="card text-center shadow" style={{ width: "200px", cursor: 'pointer' }} onClick={() => setView("patients")}>
            <div className="card-body">
              <div className="fs-1">👨‍⚕️</div>
              <h5 className="card-title">View Patients</h5>
            </div>
          </div>
          <div className="card text-center shadow" style={{ width: "200px", cursor: 'pointer' }} onClick={() => setView("symptoms")}>
            <div className="card-body">
              <div className="fs-1">🩺</div>
              <h5 className="card-title">View Symptoms</h5>
            </div>
          </div>
          <div className="card text-center shadow" style={{ width: "200px", cursor: 'pointer' }} onClick={() => setView("advices")}>
            <div className="card-body">
              <div className="fs-1">💡</div>
              <h5 className="card-title">View Advices</h5>
            </div>
          </div>
        </div>

        {view === "patients" && (
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-purple text-white fw-bold">👨‍⚕️ Patients</div>
            <ul className="list-group list-group-flush">
              {patients.map((p) => (
                <li key={p.id} className="list-group-item">
                  {p.fullName}
                </li>
              ))}
              {patients.length === 0 && (
                <li className="list-group-item text-muted">No patients found.</li>
              )}
            </ul>
          </div>
        )}

        {view === "symptoms" && (
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-purple text-white fw-bold">📝 Symptoms</div>
            <ul className="list-group list-group-flush">
              {symptoms.map((s) => (
                <li key={s.id} className="list-group-item">
                  {s.description} (Patient ID: {s.patientId})
                </li>
              ))}
              {symptoms.length === 0 && (
                <li className="list-group-item text-muted">No symptoms found.</li>
              )}
            </ul>
          </div>
        )}

        {view === "advices" && (
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-purple text-white fw-bold">💡 Advices</div>
            <ul className="list-group list-group-flush">
              {advices.map((a, index) => (
                <li key={index} className="list-group-item">
                  <strong>{a.symptomKeyword}:</strong> {a.adviceText}
                </li>
              ))}
              {advices.length === 0 && (
                <li className="list-group-item text-muted">No advices found.</li>
              )}
            </ul>
          </div>
        )}

        {view === "add" && (
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-purple text-white fw-bold">➕ Add Advice</div>
            <div className="card-body">
              {message && <div className="alert alert-info">{message}</div>}
              <form onSubmit={handleAdviceSubmit}>
                <div className="mb-3">
                  <label className="form-label">Symptom Keyword</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newAdvice.symptomKeyword}
                    onChange={(e) => setNewAdvice({ ...newAdvice, symptomKeyword: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Advice Text</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={newAdvice.adviceText}
                    onChange={(e) => setNewAdvice({ ...newAdvice, adviceText: e.target.value })}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-purple w-100">Submit Advice</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;