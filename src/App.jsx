import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import HomePage from "./Components/HomePage";
import PatientDashboard  from "./Components/PatientDashboard";
import RegisterPatient from './Pages/Register';
import AdminDashboard from './Components/AdminDashboard';
import DoctorDashboard from './Components/DoctorDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />  
        <Route path="/login" element={<Login />} /> 
        <Route path="/patient-dashboard" element={<PatientDashboard/>}/>
        <Route path="/signup" element={<RegisterPatient />} />
         <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
       
      </Routes>
    </Router>
  );
}

export default App;
