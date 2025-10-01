export const validators = {
  isEmail: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  isPhoneNumber: (phone) => {
    const regex = /^\+?[\d\s\-\(\)]+$/;
    return regex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  },

  isStrongPassword: (password) => {
    return (
      password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
  },

  isURL: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  isEmpty: (value) => {
    return value == null || value === '' || (Array.isArray(value) && value.length === 0);
  },
};
