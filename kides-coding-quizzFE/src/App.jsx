// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Register from './components/Register';
import Login from './components/Login';
import KidDashboard from './components/KidDashboard';
import AdminDashboard from './components/AdminDashboard';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

// API base URL
const API_BASE = 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('token');
    if (token) {
      validateToken(token);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Token validation error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router>
      <div className="App">
        <Header user={user} setUser={setUser} loading={loading} />
        {loading && <LoadingSpinner />}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/register" 
            element={
              user ? <Navigate to={user.role === 'admin' ? '/admin' : '/kid'} /> : 
              <Register setUser={setUser} setLoading={setLoading} />
            } 
          />
          <Route 
            path="/login" 
            element={
              user ? <Navigate to={user.role === 'admin' ? '/admin' : '/kid'} /> : 
              <Login setUser={setUser} setLoading={setLoading} />
            } 
          />
          <Route 
            path="/kid" 
            element={
              user && user.role === 'kid' ? 
              <KidDashboard user={user} setLoading={setLoading} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/admin" 
            element={
              user && user.role === 'admin' ? 
              <AdminDashboard user={user} setLoading={setLoading} /> : 
              <Navigate to="/login" />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;