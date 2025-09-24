import BaseService from './base/BaseService';
import { API_ENDPOINTS } from '../constants';

class AuthService extends BaseService {
  constructor() {
    super('/auth'); // super là gọi hàm constructor của class cha
  }

  // Login
  async login(credentials) {
    return this.post('/login', credentials);
  }

  // Register
  async register(userData) {
    return this.post('/register', userData);
  }

  // Logout
  async logout() {
    return this.post('/logout');
  }

  // Refresh token
  async refreshToken(refreshToken) {
    return this.post('/refresh', { refreshToken });
  }

  // Forgot password
  async forgotPassword(email) {
    return this.post('/forgot-password', { email });
  }

  // Reset password
  async resetPassword(token, password) {
    return this.post('/reset-password', { token, password });
  }

  // Verify email
  async verifyEmail(token) {
    return this.post('/verify-email', { token });
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    return this.put('/change-password', {
      currentPassword,
      newPassword,
    });
  }

  // Check email availability
  async checkEmailAvailability(email) {
    const query = this.buildQuery({ email });
    return this.get(`/check-email?${query}`);
  }
}

export default new AuthService();