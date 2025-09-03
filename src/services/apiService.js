// Base URL for your backend API
const API_BASE_URL = 'http://localhost:5000';

/**
 * Makes a request to the backend API
 * @param {string} endpoint - The API endpoint to call (without the base URL)
 * @param {Object} options - Fetch options (method, body, etc.)
 * @returns {Promise} - The JSON response from the API
 */
export const makeRequest = async (endpoint, options = {}) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    console.log('API Response:', response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(errorText || 'API request failed');
    }

    return response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// API methods
export const apiService = {
  // Customer methods
  getCustomers: () => makeRequest('/customer/all'),
  getCustomerById: (id) => makeRequest(`/customer/mono/${id}`),
  createCustomer: (data) => makeRequest('/customer/add', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateCustomer: (id, data) => makeRequest(`/customer/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteCustomer: (id) => makeRequest(`/customer/delete/${id}`, {
    method: 'DELETE'
  }),

  // Generic methods
  createItem: (endpoint, data) => makeRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  updateItem: (endpoint, data) => makeRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  deleteItem: (endpoint) => makeRequest(endpoint, {
    method: 'DELETE'
  })
};