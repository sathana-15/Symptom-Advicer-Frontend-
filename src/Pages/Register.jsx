import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Components/Login.css'; 
const backend_url = import.meta.env.VITE_BACKEND_URL;


const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    address: '',
    phone: '',
    roles: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backend_url}/patient/patients`, formData);
      setMessage('Registration successful!');
      navigate('/login');
    } catch (err) {
      console.error(err);
      setMessage('Registration failed. Try again.');
    }
  };

  return (
    <div className="login-background"> 
      <div className="card shadow p-4 w-100 login-box"> 
        <h3 className="text-center mb-4 text-purple fw-bold">
          <i className="bi bi-person-plus-fill me-2"></i> Register
        </h3>

        {message && <div className="alert alert-info text-center">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-control" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Username</label>
            <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Age</label>
            <input type="number" className="form-control" name="age" value={formData.age} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Gender</label>
            <select className="form-select" name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <textarea className="form-control" name="address" value={formData.address} onChange={handleChange} rows="2" required />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="mb-4">
            <label className="form-label">Select Role</label>
            <select className="form-select" name="roles" value={formData.roles} onChange={handleChange} required>
              <option value="">Choose role</option>
              <option value="ROLE_PATIENT">Patient</option>
              <option value="ROLE_DOCTOR">Doctor</option>
              <option value="ROLE_ADMIN">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn btn-purple w-100">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
