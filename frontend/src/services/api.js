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
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
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
  async getMyAttendance() {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;
    
    console.log('Fetching attendance for user:', userId);
    
    if (!userId) {
      throw new Error('User not found. Please login again.');
    }
    
    try {
      // Backend controller langsung return array dari getByUser method
      const response = await apiService.get(`/attendance/${userId}`);
      console.log('Raw attendance API response:', response);
      
      // Response adalah array langsung, bukan wrapped dalam data
      return { data: Array.isArray(response) ? response : [] };
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
      return { data: [] };
    }
  },

  async clockIn() {
    return apiService.post('/attendance', { status: 'IN' });
  },

  async clockOut() {
    return apiService.post('/attendance', { status: 'OUT' });
  },

  async getSummary(startDate, endDate) {
    return apiService.post('/attendance/summary', { startDate, endDate });
  },

  async getAllAttendance(filters = {}) {
    return { data: [] };
  },
};

export default apiService;