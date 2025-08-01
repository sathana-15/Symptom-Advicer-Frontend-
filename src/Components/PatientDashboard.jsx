import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PatientDashboard.css';
import { FaTachometerAlt } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
const backend_url = import.meta.env.VITE_BACKEND_URL; 

const PatientDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [symptomDescription, setSymptomDescription] = useState('');
  const [advice, setAdvice] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate(); 
  const token = localStorage.getItem('token');
  const loggedInPatientId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    axios
      .get(`${backend_url}/patient/patients`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const onlyDoctors = res.data.filter(user =>
          Array.isArray(user.roles)
            ? user.roles.includes("ROLE_DOCTOR")
            : user.roles === "ROLE_DOCTOR"
        );
        setPatients(onlyDoctors);
      })
      .catch((err) => console.error('Error fetching patients:', err));
  }, [token]);

  const handleSymptomSubmit = async (e) => {
    e.preventDefault();

    const symptomData = {
      description: symptomDescription,
      patientId: loggedInPatientId,
    };

    try {
      const res = await axios.post(
        `${backend_url}/api/symptoms/submit`,
        symptomData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('✅ Symptom submitted successfully.');
      setAdvice(res.data?.advice || 'No advice returned.');
      setSymptomDescription('');
    } catch (err) {
      setMessage('❌ Failed to submit symptom.');
    }
  };

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
     

      <div className="container my-5 pt-5 text-center">
        <h2 className="text-purple fw-bold mb-5">
          <i className="bi bi-heart-pulse me-2"></i>Patient Dashboard
        </h2>

        <div className="row g-4 justify-content-center">
         
          <div className="col-md-5">
            <div className="dashboard-card p-4 h-100">
              <h5 className="text-purple mb-3">🧑‍🤝‍🧑 View Patients</h5>
              <table className="table table-bordered table-sm text-center">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.fullName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          
          <div className="col-md-5">
            <div className="dashboard-card p-4 h-100">
              <h5 className="text-purple mb-3">💬 Submit Symptom</h5>
              <form onSubmit={handleSymptomSubmit}>
                <div className="mb-3 text-start">
                  <label className="form-label fw-semibold">Symptom</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., fever, cough"
                    value={symptomDescription}
                    onChange={(e) => setSymptomDescription(e.target.value)}
                    required
                  />
                </div>
                <button className="btn btn-purple w-100" type="submit">
                  Submit & Get Advice
                </button>
              </form>

              {message && <div className="alert alert-info mt-3">{message}</div>}

              {advice && (
                <div className="alert alert-purple mt-3 d-flex align-items-center">
                  <i className="bi bi-lightbulb-fill me-2 fs-5"></i>
                  <strong>Advice:</strong>&nbsp;{advice}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;