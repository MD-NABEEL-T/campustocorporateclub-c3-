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
      const requestUrl = error.config?.url || '';
      const isAuthCall = Boolean(
        requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register')
      );

      if (!isAuthCall) {
        localStorage.removeItem('c3user');

        if (typeof window !== 'undefined') {
          const pathname = window.location.pathname;
          const isPublic =
            (pathname === '/') ||
            (pathname === '/login') ||
            (pathname === '/register') ||
            (pathname === '/gallery') ||
            (pathname === '/sessions-archive') ||
            (pathname.startsWith('/apply')) ||
            (pathname.startsWith('/events/')) ||
            (pathname === '/events') ||
            (pathname.startsWith('/event/')) ||
            (pathname === '/event');

          // Redirect to /login unless on a public route (avoids redirect loops)
          if (!isPublic) {
            window.location.href = '/login';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;