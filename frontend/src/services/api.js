import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({ baseURL: BASE_URL });

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const login = (username, password) =>
  api.post('/auth/login', { username, password });

// Restaurants
export const getRestaurants = () => api.get('/restaurants');
export const getRestaurant = (id) => api.get(`/restaurants/${id}`);
export const getMenu = (restaurantId) => api.get(`/restaurants/${restaurantId}/menu`);

// Orders
export const createOrder = (data) => api.post('/orders/create', data);
export const placeOrder = (orderId, paymentMethodId) =>
  api.post(`/orders/${orderId}/place`, { paymentMethodId });
export const cancelOrder = (orderId) => api.post(`/orders/${orderId}/cancel`);
export const getMyOrders = () => api.get('/orders/my');
export const getOrder = (id) => api.get(`/orders/${id}`);

// Payment Methods
export const getPaymentMethods = () => api.get('/payment');
export const addPaymentMethod = (data) => api.post('/payment', data);
export const updatePaymentMethod = (id, data) => api.put(`/payment/${id}`, data);
export const deletePaymentMethod = (id) => api.delete(`/payment/${id}`);

export default api;
