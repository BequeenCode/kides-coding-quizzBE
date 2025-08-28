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
import { authAPI } from './utils/api'; // Import the API module
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('token');
    if (token) {
      validateToken();
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authAPI.getMe();
      setUser(data.user);
    } catch (error) {
      console.error('Token validation error:', error);
      setError('Failed to validate session. Please log in again.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="App">
        <Header user={user} setUser={setUser} loading={loading} />
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/register" 
            element={
              user ? <Navigate to={user.role === 'admin' ? '/admin' : '/kid'} /> : 
              <Register setUser={setUser} setLoading={setLoading} setError={setError} />
            } 
          />
          <Route 
            path="/login" 
            element={
              user ? <Navigate to={user.role === 'admin' ? '/admin' : '/kid'} /> : 
              <Login setUser={setUser} setLoading={setLoading} setError={setError} />
            } 
          />
          <Route 
            path="/kid" 
            element={
              user && user.role === 'kid' ? 
              <KidDashboard user={user} setLoading={setLoading} setError={setError} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/admin" 
            element={
              user && user.role === 'admin' ? 
              <AdminDashboard user={user} setLoading={setLoading} setError={setError} /> : 
              <Navigate to="/login" />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;