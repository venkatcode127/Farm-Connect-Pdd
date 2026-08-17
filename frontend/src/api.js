import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const login = (phone, password) => {
  return api.post('/auth/login', { phone, password });
};

export const register = (userData) => {
  return api.post('/auth/register', userData);
};

export default api;
