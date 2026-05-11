import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// For later: Add auth interceptor
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
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
export const fetchPublicProfile = (username) => API.get(`/auth/public/${username}`);

export default API;
