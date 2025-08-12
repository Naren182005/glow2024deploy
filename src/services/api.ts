/**
 * API Service for Glow24 Organics
 * Handles all backend communication
 */

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 
                    import.meta.env.VITE_API_URL_DEV || 
                    'http://localhost:5000/api/v1';

console.log('🔗 API Base URL:', API_BASE_URL);

// Common headers
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
});

// API request wrapper with error handling
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// Product API
export const productAPI = {
  // Get all products
  getAll: () => apiRequest('/products'),
  
  // Get products by category
  getByCategory: (category: string) => apiRequest(`/products?category=${category}`),
  
  // Get single product
  getById: (id: string) => apiRequest(`/products/${id}`),
};

// Order API
export const orderAPI = {
  // Create new order
  create: (orderData: any) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  
  // Get order by ID
  getById: (id: string) => apiRequest(`/orders/${id}`),
  
  // Update order status
  updateStatus: (id: string, status: string) => apiRequest(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
};

// Category API
export const categoryAPI = {
  // Get all categories
  getAll: () => apiRequest('/categories'),
};

// User API
export const userAPI = {
  // Register user
  register: (userData: any) => apiRequest('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  // Login user
  login: (credentials: any) => apiRequest('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
};

// Health check
export const healthCheck = () => apiRequest('/health');

// Export default API object
export default {
  products: productAPI,
  orders: orderAPI,
  categories: categoryAPI,
  users: userAPI,
  health: healthCheck,
};
