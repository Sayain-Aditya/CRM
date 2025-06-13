// Base URL for your backend API
const API_BASE_URL = 'http://localhost:5000'; // Make sure this matches your backend URL

/**
 * Makes an authenticated request to the backend API
 * @param {string} endpoint - The API endpoint to call (without the base URL)
 * @param {Object} options - Fetch options (method, body, etc.)
 * @returns {Promise} - The JSON response from the API
 */
export const makeAuthenticatedRequest = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem('firebaseToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    // Add this debug log
    console.log('API Response:', response);

    if (!response.ok) {
      const errorText = await response.text(); // Change this from json() to text()
      console.error('API Error Response:', errorText);
      throw new Error(errorText || 'API request failed');
    }

    return response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Example API methods using makeAuthenticatedRequest
export const apiService = {
  // Customer methods
  getCustomers: () => makeAuthenticatedRequest('/all'),
  getCustomerById: (id) => makeAuthenticatedRequest(`/mono/${id}`),
  createCustomer: (data) => makeAuthenticatedRequest('/add', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateCustomer: (id, data) => makeAuthenticatedRequest(`/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteCustomer: (id) => makeAuthenticatedRequest(`/delete/${id}`, {
    method: 'DELETE'
  }),
  
  // User methods
  getUserData: () => makeAuthenticatedRequest('/api/user-data'),

  // Example POST request
  createItem: (data) => makeAuthenticatedRequest('/api/items', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Example PUT request
  updateItem: (id, data) => makeAuthenticatedRequest(`/api/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  // Example DELETE request
  deleteItem: (id) => makeAuthenticatedRequest(`/api/items/${id}`, {
    method: 'DELETE'
  })
};
