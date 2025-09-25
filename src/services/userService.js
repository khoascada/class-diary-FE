import BaseService from './base/BaseService';

class UserService extends BaseService {
  constructor() {
    super('/users');
  }

  // Get current user profile
  async getProfile() {
    return this.get('/profile');
  }

  // Update user profile
  async updateProfile(profileData) {
    return this.put('/profile', profileData);
  }

  // Upload avatar
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return this.post('/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Get user by ID
  async getUserById(userId) {
    return this.get(`/${userId}`);
  }

  // Get users list with pagination
  async getUsers(params = {}) {
    const defaultParams = {
      page: 1,
      limit: 20,
      sort: 'createdAt',
      order: 'desc',
      ...params,
    };
    
    const query = this.buildQuery(defaultParams);
    return this.get(`?${query}`);
  }

  // Search users
  async searchUsers(searchTerm, filters = {}) {
    const params = {
      search: searchTerm,
      ...filters,
    };
    const query = this.buildQuery(params);
    return this.get(`/search?${query}`);
  }


  // Block/Unblock user
  async blockUser(userId) {
    return this.post(`/${userId}/block`);
  }

  async unblockUser(userId) {
    return this.delete(`/${userId}/block`);
  }

}

export default new UserService();