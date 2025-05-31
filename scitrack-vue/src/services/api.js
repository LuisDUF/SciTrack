import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL, // URL de tu backend
});

// Interceptor para añadir token a las peticiones
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;