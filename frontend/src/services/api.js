const API_BASE_URL = import.meta.env.VITE_API_URL;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Don't set Content-Type for FormData
    if (config.body && !(config.body instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
      if (typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
      }
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
      ...options,
    });
  }

  patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data,
      ...options,
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

const apiService = new ApiService();

// Auth Service
export const authService = {
  async login(email, password) {
    return apiService.post('/auth/login', { email, password });
  },

  async register(userData) {
    return apiService.post('/auth/register', userData);
  },
};

// User Service
export const userService = {
  async getProfile() {
    return apiService.get('/users/me');
  },

  async updateProfile(userData) {
    return apiService.patch('/users/update', userData);
  },

  async uploadProfilePicture(formData) {
    return apiService.post('/users/upload-photo', formData);
  },

  async getAllUsers() {
    const response = await apiService.get('/users');
    return response.data || response;
  },

  async getUserById(id) {
    return apiService.get(`/users/${id}`);
  },
};

// Attendance Service
export const attendanceService = {
  async getMyAttendance(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    return apiService.get(`/attendance/my?${params.toString()}`);
  },

  async getAllAttendance(filters = {}) {
    const params = new URLSearchParams(filters);
    return apiService.get(`/attendance?${params.toString()}`);
  },

  async clockIn() {
    return apiService.post('/attendance/clock-in');
  },

  async clockOut() {
    return apiService.post('/attendance/clock-out');
  },
};

export default apiService;