// src/utils/api.js
const API_BASE = 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Generic API call function
export const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: getAuthHeaders(),
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  register: (userData) => apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  login: (credentials) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  getMe: () => apiCall('/auth/me'),
};

// Questions API calls
export const questionsAPI = {
  getAll: (topic) => apiCall(`/questions${topic ? `?topic=${topic}` : ''}`),
  getRandom: (topic, limit = 10) => apiCall(`/questions/random/${topic}?limit=${limit}`),
  create: (questionData) => apiCall('/questions', {
    method: 'POST',
    body: JSON.stringify(questionData),
  }),
  update: (id, questionData) => apiCall(`/questions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(questionData),
  }),
  delete: (id) => apiCall(`/questions/${id}`, {
    method: 'DELETE',
  }),
};

// Results API calls
export const resultsAPI = {
  getAll: () => apiCall('/results'),
  getMyResults: () => apiCall('/results/my-results'),
  create: (resultData) => apiCall('/results', {
    method: 'POST',
    body: JSON.stringify(resultData),
  }),
};

// Certificates API calls
export const certificatesAPI = {
  getTemplate: () => apiCall('/certificates/template'),
  updateTemplate: (templateData) => apiCall('/certificates/template', {
    method: 'PUT',
    body: JSON.stringify(templateData),
  }),
};

// Users API calls (admin only)
export const usersAPI = {
  getAll: () => apiCall('/users'),
  create: (userData) => apiCall('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  update: (id, userData) => apiCall(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  delete: (id) => apiCall(`/users/${id}`, {
    method: 'DELETE',
  }),
};