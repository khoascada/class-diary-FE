import BaseService from './base/BaseService';

class UserService extends BaseService {
  constructor() {
    super('/users');
  }

  // Get current user profile
  getProfile = async () => this.get('/profile');

  // Update user profile
  updateProfile = async (profileData) => this.put('/profile', profileData);

  // Upload avatar
  uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.post('/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  // Get user by ID
  getUserById = async (userId) => this.get(`/${userId}`);

  // Get users list with pagination
  getUsers = async (params = {}) => {
    const defaultParams = {
      page: 1,
      limit: 20,
      sort: 'createdAt',
      order: 'desc',
      ...params,
    };

    const query = this.buildQuery(defaultParams);
    return this.get(`?${query}`);
  };

  // Search users
  searchUsers = async (searchTerm, filters = {}) => {
    const params = {
      search: searchTerm,
      ...filters,
    };
    const query = this.buildQuery(params);
    return this.get(`/search?${query}`);
  };

  // Block/Unblock user
  blockUser = async (userId) => this.post(`/${userId}/block`);

  unblockUser = async (userId) => this.delete(`/${userId}/block`);
}

const userService = new UserService();
export default userService;
