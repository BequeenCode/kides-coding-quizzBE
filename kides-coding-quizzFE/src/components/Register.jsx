// src/components/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';

const Register = ({ setUser, setLoading, setError }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'kid',
    age: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.role === 'kid' && !formData.age) {
      newErrors.age = 'Age is required for students';
    } else if (formData.age && (formData.age < 7 || formData.age > 14)) {
      newErrors.age = 'Age must be between 7 and 14 for students';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    if (setLoading) setLoading(true);

    try {
      const { confirmPassword, ...submitData } = formData;
      const data = await authAPI.register(submitData);

      let userData, token;

      if (data.token && data.user) {
        token = data.token;
        userData = data.user;
      } else if (data.data && data.data.token && data.data.user) {
        token = data.data.token;
        userData = data.data.user;
      } else {
        console.error('Unexpected response format:', data);
        throw new Error('Invalid response format from server');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      if (setUser) setUser(userData);
      if (setError) setError(null);

      navigate(userData.role === 'admin' ? '/admin' : '/kid');
    } catch (error) {
      console.error('Registration error:', error);

      let errorMsg = 'Registration failed. Please try again.';
      if (error.message) errorMsg = error.message;
      else if (error.response?.data?.message) errorMsg = error.response.data.message;
      else if (error.errors?.length) errorMsg = error.errors.map(err => err.msg).join(', ');

      if (setError) setError(errorMsg);
      else alert(errorMsg);
    } finally {
      setIsSubmitting(false);
      if (setLoading) setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 80px)',
      padding: '20px',
      backgroundColor: '#f5f7f9'
    },
    card: {
      background: 'white',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '450px'
    },
    formGroup: { marginBottom: '20px' },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#34495e'
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '16px'
    },
    errorText: {
      color: '#e74c3c',
      fontSize: '14px',
      marginTop: '5px',
      display: 'block'
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      cursor: 'pointer',
      marginTop: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#2c3e50' }}>
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          {['name', 'username', 'password', 'confirmPassword'].map(field => (
            <div key={field} style={styles.formGroup}>
              <label style={styles.label} htmlFor={field}>
                {field === 'confirmPassword' ? 'Confirm Password:' : field.charAt(0).toUpperCase() + field.slice(1) + ':'}
              </label>
              <input
                type={field.includes('password') ? 'password' : 'text'}
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors[field] ? { borderColor: '#e74c3c' } : {})
                }}
                required
              />
              {errors[field] && <span style={styles.errorText}>{errors[field]}</span>}
            </div>
          ))}

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="role">I am a:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="kid">Student</option>
              <option value="admin">Teacher/Admin</option>
            </select>
          </div>

          {formData.role === 'kid' && (
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="age">Age:</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="7"
                max="14"
                style={{
                  ...styles.input,
                  ...(errors.age ? { borderColor: '#e74c3c' } : {})
                }}
              />
              {errors.age && <span style={styles.errorText}>{errors.age}</span>}
            </div>
          )}

          <button type="submit" style={styles.button} disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#7f8c8d' }}>
          Already have an account? <Link to="/login" style={{ color: '#3498db' }}>Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
