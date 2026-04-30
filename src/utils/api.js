import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL || '/api';
const api = axios.create({ baseURL });

api.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('AasaiPet_user') || '{}');
  if (user.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    const message = err.response?.data?.message || err.message;
    return Promise.reject(new Error(message));
  }
);

// Products
export const fetchProducts = (params) => api.get('/products', { params });
export const fetchFeaturedProducts = () => api.get('/products/featured');
export const fetchProduct = (id) => api.get(`/products/${id}`);
export const fetchAllProductsAdmin = () => api.get('/products/admin/all');
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Categories
export const fetchCategories = () => api.get('/categories');
export const fetchCategoriesAdmin = () => api.get('/categories/admin');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Orders
export const createOrder = (data) => api.post('/orders', data);
export const fetchMyOrders = () => api.get('/orders/myorders');
export const fetchOrder = (id) => api.get(`/orders/${id}`);
export const fetchAllOrders = (params) => api.get('/orders', { params });
export const payOrder = (id, data) => api.put(`/orders/${id}/pay`, data);
export const updateOrderStatus = (id, data) => api.put(`/orders/${id}/status`, data);

// Users
export const fetchAllUsers = (params) => api.get('/users', { params });
export const toggleBlockUser = (id) => api.put(`/users/${id}/block`);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Analytics
export const fetchOverview = () => api.get('/analytics/overview');
export const fetchSalesData = (days) => api.get('/analytics/sales', { params: { days } });
export const fetchTopProducts = () => api.get('/analytics/top-products');
export const fetchOrdersByStatus = () => api.get('/analytics/orders-by-status');
export const fetchRecentActivity = () => api.get('/analytics/recent-activity');
export const fetchCategorySales = () => api.get('/analytics/category-sales');

// Payment
export const getRazorpayKey = () => api.get('/payment/key');
export const createRazorpayOrder = (amount) => api.post('/payment/create-order', { amount });
export const verifyPayment = (data) => api.post('/payment/verify', data);

export default api;
