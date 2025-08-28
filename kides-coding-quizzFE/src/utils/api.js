// src/utils/api.js
const API_BASE = 'http://localhost:5000/api';

// Debug mode - set to false in production
const DEBUG_MODE = process.env.NODE_ENV !== 'production';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Helper to log debug messages
const debugLog = (message, data = null) => {
  if (DEBUG_MODE) {
    console.log(`[API Debug] ${message}`, data || '');
  }
};

// Generic API call function with enhanced error handling
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: getAuthHeaders(),
    ...options,
  };

  debugLog(`Making request to: ${url}`, config);

  try {
    const response = await fetch(url, config);
    
    // Handle unauthorized responses
    if (response.status === 401) {
      debugLog('Unauthorized request, redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      
      throw new Error('Authentication failed. Please log in again.');
    }

    if (!response.ok) {
      // Try to get error message from response
      let errorMsg = `API error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorData.error || errorMsg;
      } catch (e) {
        // Ignore if no JSON response
        debugLog('No JSON error response', e);
      }
      throw new Error(errorMsg);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      debugLog('204 No Content response');
      return null;
    }

    const data = await response.json();
    debugLog('Response received', data);
    return data;
  } catch (error) {
    debugLog('API call failed', error);
    
    // Enhance network errors
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Network error. Please check if the server is running.');
    }
    
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
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    debugLog('User logged out');
  },
};

// Questions API calls
export const questionsAPI = {
  getAll: (topic) => apiCall(`/questions${topic ? `?topic=${topic}` : ''}`),
  getById: (id) => apiCall(`/questions/${id}`),
  getRandom: (topic, limit = 10) => apiCall(`/questions/random${topic ? `/${topic}` : ''}?limit=${limit}`),
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
  getTopics: () => apiCall('/questions/topics'),
};

// Results API calls
export const resultsAPI = {
  getAll: () => apiCall('/results'),
  getById: (id) => apiCall(`/results/${id}`),
  getMyResults: () => apiCall('/results/my-results'),
  create: (resultData) => apiCall('/results', {
    method: 'POST',
    body: JSON.stringify(resultData),
  }),
  getUserResults: (userId) => apiCall(`/results/user/${userId}`),
};

// Certificates API calls
export const certificatesAPI = {
  getTemplate: () => apiCall('/certificates/template'),
  updateTemplate: (templateData) => apiCall('/certificates/template', {
    method: 'PUT',
    body: JSON.stringify(templateData),
  }),
  generateCertificate: (userId, resultId) => 
    apiCall(`/certificates/generate/${userId}/${resultId}`),
  getMyCertificates: () => apiCall('/certificates/my-certificates'),
  getUserCertificates: (userId) => apiCall(`/certificates/user/${userId}`),
};

// Users API calls (admin only)
export const usersAPI = {
  getAll: () => apiCall('/users'),
  getById: (id) => apiCall(`/users/${id}`),
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
  updateProfile: (userData) => apiCall('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  changePassword: (passwordData) => apiCall('/users/change-password', {
    method: 'PUT',
    body: JSON.stringify(passwordData),
  }),
};

// Health check API call
export const healthAPI = {
  check: () => apiCall('/health'),
};

// Utility function to check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Utility function to get current user info
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    debugLog('Error parsing user data', e);
    return null;
  }
};

// Utility function to set authentication tokens
export const setAuthToken = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  debugLog('Auth token set');
};

export default {
  apiCall,
  authAPI,
  questionsAPI,
  resultsAPI,
  certificatesAPI,
  usersAPI,
  healthAPI,
  isAuthenticated,
  getCurrentUser,
  setAuthToken,
};