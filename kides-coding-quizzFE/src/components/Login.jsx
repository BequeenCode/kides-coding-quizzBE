// src/components/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';

const Login = ({ setUser, setLoading }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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

    // Simple validation
    if (!formData.username.trim() || !formData.password) {
      setError('Please enter both username and password');
      setIsSubmitting(false);
      if (setLoading) setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        
        if (response.ok) {
          // Save token to localStorage
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          if (setUser) setUser(data.user);
          
          // Redirect based on user role
          if (data.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        } else {
          setError(data.message || `Login failed with status: ${response.status}`);
        }
      } else {
        // Response is not JSON - likely a server error
        const text = await response.text();
        console.error('Server returned non-JSON response:', text.substring(0, 200));
        setError('Server error: Invalid response format');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.message === 'Failed to fetch') {
        setError('Cannot connect to server. Please check if the backend is running.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
      if (setLoading) setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Inline styles for the component
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f0f2f5',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    card: {
      background: 'white',
      padding: '2.5rem',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '450px'
    },
    title: {
      textAlign: 'center',
      marginBottom: '1.5rem',
      color: '#2c3e50',
      fontSize: '1.8rem'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '600',
      color: '#34495e'
    },
    input: {
      width: '100%',
      padding: '14px',
      border: '2px solid #e1e8ed',
      borderRadius: '8px',
      fontSize: '16px',
      boxSizing: 'border-box',
      transition: 'all 0.3s ease'
    },
    inputFocus: {
      borderColor: '#3498db',
      boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.2)'
    },
    errorText: {
      color: '#e74c3c',
      fontSize: '14px',
      marginTop: '8px',
      display: 'block',
      padding: '10px',
      backgroundColor: '#fdf0ed',
      borderRadius: '6px',
      borderLeft: '4px solid #e74c3c'
    },
    button: {
      width: '100%',
      padding: '14px',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    },
    buttonHover: {
      backgroundColor: '#2980b9',
      transform: 'translateY(-2px)'
    },
    buttonDisabled: {
      opacity: '0.7',
      cursor: 'not-allowed'
    },
    link: {
      color: '#3498db',
      textDecoration: 'none',
      fontWeight: '500'
    },
    linkHover: {
      textDecoration: 'underline'
    },
    footer: {
      textAlign: 'center',
      marginTop: '20px',
      color: '#6c757d'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login to Your Account</h2>
        
        {error && <div style={styles.errorText}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
              required
              disabled={isSubmitting}
              onFocus={(e) => {
                Object.assign(e.target.style, styles.inputFocus);
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e1e8ed';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="Enter your username"
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
              disabled={isSubmitting}
              onFocus={(e) => {
                Object.assign(e.target.style, styles.inputFocus);
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e1e8ed';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="Enter your password"
            />
          </div>
          
          <button 
            type="submit" 
            style={{
              ...styles.button,
              ...(isSubmitting && styles.buttonDisabled)
            }}
            disabled={isSubmitting}
            onMouseOver={(e) => {
              if (!isSubmitting) {
                Object.assign(e.target.style, styles.buttonHover);
              }
            }}
            onMouseOut={(e) => {
              if (!isSubmitting) {
                e.target.style.backgroundColor = styles.button.backgroundColor;
                e.target.style.transform = 'none';
              }
            }}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link 
            to="/register" 
            style={styles.link}
            onMouseOver={(e) => {
              e.target.style.textDecoration = styles.linkHover.textDecoration;
            }}
            onMouseOut={(e) => {
              e.target.style.textDecoration = 'none';
            }}
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;