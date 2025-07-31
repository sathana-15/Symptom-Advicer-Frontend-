import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [advices, setAdvices] = useState([]);
  const [newAdvice, setNewAdvice] = useState({ symptomKeyword: '', adviceText: '' });
  const [message, setMessage] = useState('');

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
      setPatients(Array.isArray(res.data) ? res.data : []);
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
    <div className="container mt-4">
      <h2 className="text-center text-purple mb-4">🩺 Doctor Dashboard</h2>

      {/* Patients Section */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-purple text-white fw-bold">👨‍⚕️ Patients</div>
        <ul className="list-group list-group-flush">
          {patients.map((p) => (
            <li key={p.id} className="list-group-item">
              {p.name} (ID: {p.id}) - {p.email}
            </li>
          ))}
          {patients.length === 0 && <li className="list-group-item text-muted">No patients found.</li>}
        </ul>
      </div>

      
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-purple text-white fw-bold">📝 Symptoms</div>
        <ul className="list-group list-group-flush">
          {symptoms.map((s) => (
            <li key={s.id} className="list-group-item">
              {s.description} (Patient ID: {s.patientId})
            </li>
          ))}
          {symptoms.length === 0 && <li className="list-group-item text-muted">No symptoms found.</li>}
        </ul>
      </div>

     
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-purple text-white fw-bold">💡 Advices</div>
        <ul className="list-group list-group-flush">
          {advices.map((a, index) => (
            <li key={index} className="list-group-item">
              <strong>{a.symptomKeyword}:</strong> {a.adviceText}
            </li>
          ))}
          {advices.length === 0 && <li className="list-group-item text-muted">No advices found.</li>}
        </ul>
      </div>

      
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
    </div>
  );
};

export default DoctorDashboard;
