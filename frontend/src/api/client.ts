import axios from 'axios';
import type { Product } from '../types';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('garments_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const token = localStorage.getItem('garments_token');
      // Only clear if there was a token (avoid clearing on public endpoints)
      if (token && !error.config.url.includes('/auth/')) {
        localStorage.removeItem('garments_token');
        localStorage.removeItem('garments_user');
        // Redirect to login (will happen via context)
      }
    }
    return Promise.reject(error);
  }
);

// ===== AUTH API =====
export const authApi = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data)
};

// ===== USERS API (admin only) =====
export const userApi = {
  getAll: () => api.get('/auth/users'),
  updateRole: (id: string, role: string) =>
    api.put(`/auth/users/${id}/role`, { role }),
  remove: (id: string) => api.delete(`/auth/users/${id}`)
};

// ===== CATEGORIES API =====
export const categoryApi = {
  getAll: () => api.get('/categories'),
  getById: (id: string) => api.get(`/categories/${id}`),
  create: (data: { name: string; description?: string }) =>
    api.post('/categories', data),
  update: (id: string, data: { name: string; description?: string }) =>
    api.put(`/categories/${id}`, data),
  remove: (id: string) => api.delete(`/categories/${id}`)
};

// ===== PRODUCTS API =====
export const productApi = {
  getAll: (params?: { category_id?: string; search?: string }) =>
    api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: Partial<Product>) => api.post('/products', data),
  update: (id: string, data: Partial<Product>) => api.put(`/products/${id}`, data),
  remove: (id: string) => api.delete(`/products/${id}`)
};

// ===== CART API =====
export const cartApi = {
  get: () => api.get('/cart'),
  add: (data: { product_id: string; quantity: number }) =>
    api.post('/cart', data),
  update: (id: string, quantity: number) => api.put(`/cart/${id}`, { quantity }),
  remove: (id: string) => api.delete(`/cart/${id}`),
  clear: () => api.delete('/cart')
};

// ===== ORDERS API =====
export const orderApi = {
  create: (data: { shipping_address: string; city: string; phone: string }) =>
    api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, status: string) =>
    api.put(`/orders/${id}/status`, { status })
};

export default api;

