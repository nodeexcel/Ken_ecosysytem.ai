import axios from 'axios';
import i18n from '../i18n';

/**
 * Axios instance configured for the application.
 *
 * - Base URL comes from `VITE_BASE_URL` environment variable.
 * - Default `Content-Type` set to `application/json`.
 * - Handles token refresh automatically on 401 responses.
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      const currentLang = i18n.language
      config.headers['Accept-Language'] = currentLang;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh logic
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized and we haven't already retried
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/auth/refresh-token`,
          { token: refreshToken }
        );

        const newAccessToken = response.data.accessToken;

        // Save new token and update original request
        localStorage.setItem('token', newAccessToken);
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Optionally, redirect to login
        localStorage.clear()
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
