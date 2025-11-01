import './styles.css'
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Login from './Login';

function App() {
  return (
    <Routes> {/* Routes component wraps all individual routes */}
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App
