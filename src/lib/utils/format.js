export const formatters = {
  // Date formatting
  formatDate: (date, locale = 'en-US', options = {}) => {
    if (!date) return '';
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(date).toLocaleDateString(locale, { ...defaultOptions, ...options });
  },

  formatDateTime: (date, locale = 'en-US') => {
    if (!date) return '';
    return new Date(date).toLocaleString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  formatRelativeTime: (date) => {
    if (!date) return '';
    const now = new Date();
    const target = new Date(date);
    const diff = now - target;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return formatters.formatDate(date);
  },

  formatDateVi: (date) => {
    if (!date) return '';
    const d = new Date(date);
    const dayName = d.toLocaleDateString('vi-VN', { weekday: 'long' });
    const dateString = d.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
    return `${dayName}, ${dateString}`;
  },

  // Number formatting
  formatNumber: (number, locale = 'en-US') => {
    if (typeof number !== 'number') return number;
    return new Intl.NumberFormat(locale).format(number);
  },

  formatCurrency: (amount, currency = 'USD', locale = 'en-US') => {
    if (typeof amount !== 'number') return amount;
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  },

  formatPercentage: (value, decimals = 1) => {
    if (typeof value !== 'number') return value;
    return `${(value * 100).toFixed(decimals)}%`;
  },

  // File size formatting
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // String formatting
  truncateText: (text, length = 100, suffix = '...') => {
    if (!text || text.length <= length) return text;
    return text.substring(0, length) + suffix;
  },

  slugify: (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  },

  capitalizeFirst: (text) => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
  },

  // Phone number formatting
  formatPhoneNumber: (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  },
};
