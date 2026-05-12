import axios from 'axios';

const resolveApiBaseUrl = () => {
  const raw = import.meta.env.VITE_API_URL;
  const fallbackProd = 'https://kkoneurl.kanniyakumarione.com/api';
  const isLocalHost = typeof window !== 'undefined' && /localhost|127\.0\.0\.1/i.test(window.location.hostname);

  if (raw && /^https?:\/\//i.test(raw)) {
    try {
      const parsed = new URL(raw);
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';

      // Guard against accidental frontend-host API values in production (e.g. vercel domain).
      if (!isLocalHost && currentHost && parsed.hostname === currentHost) {
        return fallbackProd;
      }

      return raw;
    } catch (_) {
      return fallbackProd;
    }
  }

  // Handle relative values like "/api" that can break on some production hosts.
  if (raw && raw.startsWith('/')) {
    if (isLocalHost) {
      return `http://localhost:5000${raw}`;
    }
    return `https://kkoneurl.kanniyakumarione.com${raw}`;
  }

  if (isLocalHost) {
    return 'http://localhost:5000/api';
  }

  return fallbackProd;
};

const API = axios.create({
  baseURL: resolveApiBaseUrl(),
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
export const generateApiKey = () => API.post('/auth/generate-api-key');
export const signupNewsletter = (username, email) => API.post(`/auth/newsletter/${username}/signup`, { email });

export const fetchNotifications = () => API.get('/notifications');
export const deleteNotification = (id) => API.delete(`/notifications/${id}`);

// Bundles
export const fetchBundles = () => API.get('/bundles');
export const createBundle = (data) => API.post('/bundles', data);
export const moveLinkToBundle = (linkId, bundleId) => API.post('/bundles/move', { linkId, bundleId });
export const deleteBundle = (id) => API.delete(`/bundles/${id}`);
export const markNotificationRead = (id) => API.patch(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => API.patch('/notifications/read-all');

export const fetchGlobalStats = () => API.get('/public-stats');

// Admin
export const fetchAdminStats = () => API.get('/admin/stats');
export const fetchAdminUsers = () => API.get('/admin/users');
export const fetchAdminLinks = () => API.get('/admin/links');

export default API;
