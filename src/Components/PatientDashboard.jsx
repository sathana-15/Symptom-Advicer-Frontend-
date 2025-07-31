import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PatientDashboard.css';

const PatientDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [symptomDescription, setSymptomDescription] = useState('');
  const [advice, setAdvice] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');
  const loggedInPatientId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    axios
      .get('http://localhost:8080/patient/patients', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPatients(res.data))
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
        'http://localhost:8080/api/symptoms/submit',
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
    <div className="container my-5 text-center">
      <h2 className="text-purple fw-bold mb-4">
        <i className="bi bi-person-circle me-2"></i>Patient Dashboard
      </h2>

      
      <div className="d-flex justify-content-center mb-5">
        <div className="dashboard-box p-4 text-start">
          <h4 className="text-center text-purple mb-3">
            <i className="bi bi-people-fill me-2"></i>View Patients
          </h4>
          <table className="table table-bordered text-center">
            <thead className="table-light">
              <tr>
                <th>Patient ID</th>
                <th>Full Name</th>
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

     
      <div className="d-flex justify-content-center">
        <div className="dashboard-box p-4 text-start">
          <h4 className="text-center text-purple mb-3">
            <i className="bi bi-journal-medical me-2"></i>Submit Symptom & Get Advice
          </h4>
          <form onSubmit={handleSymptomSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Symptom</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., fever, headache"
                value={symptomDescription}
                onChange={(e) => setSymptomDescription(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-purple w-100" type="submit">
              <i className="bi bi-send me-2"></i>Submit & Get Advice
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
  );
};

export default PatientDashboard;
