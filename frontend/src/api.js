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

export const getListings = () => api.get('/listings');
export const createListing = (listingData) => api.post('/listings', listingData);

export const getOrders = () => api.get('/orders');
export const createOrder = (orderData) => api.post('/orders', orderData);
export const updateOrder = (orderId, updateData) => api.put(`/orders/${orderId}`, updateData);

export const getReviews = (params) => api.get('/reviews', { params });
export const createReview = (reviewData) => api.post('/reviews', reviewData);
export const getRatingSummary = (username, targetType = 'farmer') => 
  api.get(`/reviews/summary/${encodeURIComponent(username)}`, { params: { targetType } });

export const getUserReputation = (username) =>
  api.get(`/users/${encodeURIComponent(username)}/reputation`);

// ─── Market Prices & AI Prediction ─────────────────────────────────────────
// Single source of truth — used by Dashboard, Market Prices, and Prediction pages
export const getMarketOverview = (market = 'delhi') =>
  api.get('/market/overview', { params: { market } });

export const getPrediction = (crop, market, cropName, marketName) =>
  api.get('/predictions', { params: { crop, market, cropName, marketName, days: 15 } });

export default api;

