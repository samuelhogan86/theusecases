import './styles.css'
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Login from './Login';
import PatientPortal from './PatientPortal';
import DoctorPortal from './DoctorPortal';
import AdminPortal from './AdminPortal';

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
