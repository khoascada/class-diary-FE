import BaseService from './base/BaseService';

class AuthService extends BaseService {
  constructor() {
    super('/auth'); // super là gọi hàm constructor của class cha
  }

  // Login
  login = async (credentials) => this.post('/login', credentials);

  // Register
  register = async (userData) => this.post('/register', userData);

  // Logout
  logout = async () => this.post('/logout');

  // Refresh token
  refreshToken = async (refreshToken) => this.post('/refresh', { refreshToken });

  // Forgot password
  forgotPassword = async (email) => this.post('/forgot-password', { email });

  // Reset password
  resetPassword = async (token, password) => this.post('/reset-password', { token, password });

  // Verify email
  verifyEmail = async (token) => this.post('/verify-email', { token });

  // Change password
  changePassword = async (currentPassword, newPassword) =>
    this.put('/change-password', { currentPassword, newPassword });

  // Check email availability
  checkEmailAvailability = async (email) => {
    const query = this.buildQuery({ email });
    return this.get(`/check-email?${query}`);
  };
}

const authService = new AuthService();
export default authService;
