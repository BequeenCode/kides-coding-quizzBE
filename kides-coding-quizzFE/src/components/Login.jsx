// src/components/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';

const Login = ({ setUser, setLoading }) => {
  const [formData, setFormData] = useState({
    identifier: '', // can be username or email
    password: '',
    role: 'kid', // user selects if they are student or admin
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const API_BASE = 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (setLoading) setLoading(true);
    setError('');

    if (!formData.identifier.trim() || !formData.password) {
      setError('Please enter both identifier and password');
      setIsSubmitting(false);
      if (setLoading) setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          if (setUser) setUser(data.user);

          navigate(data.user.role === 'admin' ? '/admin' : '/kid');
        } else {
          setError(data.message || `Login failed with status: ${response.status}`);
        }
      } else {
        const text = await response.text();
        console.error('Server returned non-JSON response:', text.substring(0, 200));
        setError('Server error: Invalid response format');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message === 'Failed to fetch'
        ? 'Cannot connect to server. Please check if backend is running.'
        : 'Login failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
      if (setLoading) setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '20px' },
    card: { background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%', maxWidth: '450px' },
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '5px', fontWeight: '600', color: '#34495e' },
    input: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px' },
    button: { width: '100%', padding: '12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer' },
    errorText: { color: '#e74c3c', marginTop: '5px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#2c3e50' }}>Login</h2>

        {error && <div style={styles.errorText}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              {formData.role === 'admin' ? 'Email:' : 'Username:'}
            </label>
            <input
              type={formData.role === 'admin' ? 'email' : 'text'}
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              style={styles.input}
              required
              placeholder={formData.role === 'admin' ? 'Enter your email' : 'Enter your username'}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
              placeholder="Enter your password"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>I am a:</label>
            <select name="role" value={formData.role} onChange={handleChange} style={styles.input}>
              <option value="kid">Student</option>
              <option value="admin">Teacher/Admin</option>
            </select>
          </div>

          <button type="submit" style={styles.button} disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '15px', color: '#7f8c8d' }}>
          Don't have an account? <Link to="/register" style={{ color: '#3498db' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
