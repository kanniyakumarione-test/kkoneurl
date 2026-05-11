import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Automatically attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchLinks = () => API.get('/links');
export const createLink = (linkData) => API.post('/links/shorten', linkData);
export const deleteLink = (id) => API.delete(`/links/${id}`);
export const toggleLinkStatus = (id) => API.patch(`/links/${id}/toggle`);
export const fetchLinkAnalytics = (id) => API.get(`/links/${id}/analytics`);

export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/register', userData);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (profileData) => API.put('/auth/profile', profileData);
export const deleteAccount = () => API.delete('/auth/delete-account');
export const fetchPublicProfile = (username) => API.get(`/auth/public/${username}`);
export const changePassword = (passwordData) => API.put('/auth/change-password', passwordData);

export default API;
