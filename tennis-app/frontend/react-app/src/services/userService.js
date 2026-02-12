import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const UserService = {
  /**
   * Register a new user
   * @param {string} name - User's full name
   * @param {string} email - User's email
   * @param {string} password - User's password (min 6 characters)
   * @param {string} [phone] - User's phone number (optional)
   * @param {string} [skillLevel] - User's skill level (optional)
   * @returns {Promise<{success: boolean, message: string, user: object|null}>}
   */
  register: async (name, email, password, phone = null, skillLevel = null) => {
    try {
      const data = {
        name,
        email,
        password,
      };

      // Add optional fields if provided
      if (phone) {
        data.phone = phone;
      }
      if (skillLevel) {
        data.skill_level = skillLevel;
      }

      const response = await apiClient.post('/users/register', data);

      // If we reach here, axios succeeded (status 2xx)
      return {
        success: true,
        message: response.data.message || 'User registered successfully',
        user: response.data.user,
      };
    } catch (error) {
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        return {
          success: false,
          message: error.response.data?.message || 'Registration failed',
          user: null,
        };
      } else if (error.request) {
        // Request was made but no response received
        return {
          success: false,
          message: 'Unable to connect to server. Please check if the backend is running.',
          user: null,
        };
      } else {
        // Something else happened
        return {
          success: false,
          message: `Error: ${error.message}`,
          user: null,
        };
      }
    }
  },

  /**
   * Login a user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<{success: boolean, message: string, user: object|null}>}
   */
  login: async (email, password) => {
    try {
      const data = {
        email,
        password,
      };
      const response = await apiClient.post('/users/login', data);
      
      // If we reach here, axios succeeded (status 2xx)
      return {
        success: true,
        message: response.data.message,
        user: response.data.user,
      };
    } catch (error) {
      // Check if server responded with error (400, 500, etc.)
      if (error.response) {
        // Server responded but with error status
        return {
          success: false,
          message: error.response.data?.message || 'Login failed',
          user: null,
        };
      } else if (error.request) {
        // Request was made but no response received (server not running)
        return {
          success: false,
          message: 'Unable to connect to server. Please check if the backend is running.',
          user: null,
        };
      } else {
        // Something else happened
        return {
          success: false,
          message: `Error: ${error.message}`,
          user: null,
        };
      }
    }
  },
};
