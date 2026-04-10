import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Create axios instance with defaults
const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses by clearing auth and redirecting to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Generation API
export const generateText = async (triples) => {
  const response = await api.post('/generate', { triples });
  return response.data;
};

export const saveGeneration = async (data) => {
  const response = await api.post('/generations/save', data);
  return response.data;
};

export const getMyGenerations = async () => {
  const response = await api.get('/generations/my');
  return response.data;
};

export const deleteGeneration = async (id) => {
  const response = await api.delete(`/generations/${id}`);
  return response.data;
};

export const exportGenerations = async () => {
  const response = await api.get('/generations/export');
  return response.data;
};

// Admin API
export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getRecentGenerations = async (limit = 10) => {
  const response = await api.get(`/admin/recent-generations?limit=${limit}`);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

// Health check
export const getHealthStatus = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
