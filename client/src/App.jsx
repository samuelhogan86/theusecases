import './styles.css'
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import PatientPortal from './components/PatientPortal';
import DoctorPortal from './components/DoctorPortal';
import AdminPortal from './components/AdminPortal';

function App() {
  return (
    <Routes> {/* Routes component wraps all individual routes */}
      <Route path="/" element={<Login />} />
      <Route path="/patient-portal" element={<PatientPortal />} />
      <Route path="/doctor-portal" element={<DoctorPortal />} />
      <Route path="/admin-portal" element={<AdminPortal />} />
    </Routes>
  );
}

export default App
