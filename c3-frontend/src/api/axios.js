import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Automatically inject JWT token from localStorage if present
api.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization) {
      try {
        const storedUser = localStorage.getItem('c3user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          if (parsed?.token) {
            config.headers.Authorization = `Bearer ${parsed.token}`;
          }
        }
      } catch {
        // ignore parse error
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthRoute = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
      if (!isAuthRoute) {
        localStorage.removeItem('c3user');
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/dashboard')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;