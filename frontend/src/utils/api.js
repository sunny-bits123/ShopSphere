import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const logoutUser = () => API.post('/auth/logout');
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/me', data);
export const updatePassword = (data) => API.put('/auth/password', data);

// ── Addresses ─────────────────────────────────────
export const addAddress = (data) => API.post('/auth/address', data);
export const updateAddress = (id, data) => API.put(`/auth/address/${id}`, data);
export const deleteAddress = (id) => API.delete(`/auth/address/${id}`);
export const setDefaultAddress = (id) => API.put(`/auth/address/${id}/default`);

// ── Products ──────────────────────────────────────
export const getProducts = (params) => API.get('/products', { params });
export const getProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const addReview = (id, data) => API.post(`/products/${id}/reviews`, data);

// ── Categories ───────────────────────────────────
export const getCategories = () => API.get('/categories');

// ── Orders ───────────────────────────────────────
export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/me');
export const getOrder = (id) => API.get(`/orders/${id}`);
export const getAllOrders = (params) => API.get('/orders', { params });
export const updateOrderStatus = (id, data) => API.put(`/orders/${id}/status`, data);
export const updateOrderToPaid = (id, data) => API.put(`/orders/${id}/pay`, data);

// ── Users (Admin) ────────────────────────────────
export const getAllUsers = () => API.get('/users');
export const deleteUser = (id) => API.delete(`/users/${id}`);
export const toggleWishlist = (productId) => API.post(`/users/wishlist/${productId}`);

// ── Payment ──────────────────────────────────────
export const createRazorpayOrder = (amount) =>
  API.post('/payment/create-order', { amount });
export const verifyPayment = (data) => API.post('/payment/verify', data);

export default API;
