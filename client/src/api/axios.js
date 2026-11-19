import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

api.interceptors.request.use((config) => {
  try {
    const token = JSON.parse(localStorage.getItem('kormohub-auth'))?.state?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    /* ignore corrupt storage */
  }
  return config;
});

export const errMsg = (e) => e.response?.data?.message || e.message || 'Something went wrong';

export default api;
