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
    age: '',
    email: '' // added email field
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (formData.role === 'kid') {
      if (!formData.age) newErrors.age = 'Age is required for students';
      else if (formData.age < 7 || formData.age > 14) newErrors.age = 'Age must be between 7 and 14';
    }

    if (formData.role === 'admin' && !formData.email.trim()) {
      newErrors.email = 'Email is required for admin registration';
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

      const token = data.token || data.data?.token;
      const userData = data.user || data.data?.user;

      if (!token || !userData) throw new Error('Invalid server response');

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      if (setUser) setUser(userData);
      if (setError) setError(null);

      navigate(userData.role === 'admin' ? '/admin' : '/kid');
    } catch (error) {
      console.error('Registration error:', error);
      const errorMsg =
        error.response?.data?.message || error.message || 'Registration failed. Please try again.';
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
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px', backgroundColor: '#f5f7f9' },
    card: { background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '450px' },
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#34495e' },
    input: { width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px' },
    errorText: { color: '#e74c3c', fontSize: '14px', marginTop: '5px', display: 'block' },
    button: { width: '100%', padding: '12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#2c3e50' }}>Create Your Account</h2>
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
                style={{ ...styles.input, ...(errors[field] ? { borderColor: '#e74c3c' } : {}) }}
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
                style={{ ...styles.input, ...(errors.age ? { borderColor: '#e74c3c' } : {}) }}
              />
              {errors.age && <span style={styles.errorText}>{errors.age}</span>}
            </div>
          )}

          {formData.role === 'admin' && (
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{ ...styles.input, ...(errors.email ? { borderColor: '#e74c3c' } : {}) }}
                required
              />
              {errors.email && <span style={styles.errorText}>{errors.email}</span>}
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
