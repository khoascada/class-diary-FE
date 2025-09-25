import { apiAxios } from "@/lib/api";

class BaseService {
  constructor(baseURL = '') {
    this.baseURL = baseURL; // như này thì tùy biến prefix cho từng service con
    this.api = apiAxios;
  }

  // Standard CRUD operations
  async get(url, config = {}) {
    try {
      const response = await this.api.get(`${this.baseURL}${url}`, config);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post(url, data = {}, config = {}) {
    try {
      const response = await this.api.post(`${this.baseURL}${url}`, data, config);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put(url, data = {}, config = {}) {
    try {
      const response = await this.api.put(`${this.baseURL}${url}`, data, config);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async patch(url, data = {}, config = {}) {
    try {
      const response = await this.api.patch(`${this.baseURL}${url}`, data, config);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(url, config = {}) {
    try {
      const response = await this.api.delete(`${this.baseURL}${url}`, config);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Response handler - customize based on API structure
  handleResponse(response) {
    // If API returns data in response.data.data
    if (response.data && response.data.data !== undefined) {
      return {
        data: response.data.data,
        message: response.data.message,
        success: response.data.success || true,
        meta: response.data.meta || null,
      };
    }
    
    // If API returns data directly in response.data
    return {
      data: response.data,
      success: true,
      message: 'Success',
    };
  }

  // Error handler
  handleError(error) {
    const errorData = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
      data: error.response?.data || null,
    };
    
    return errorData;
  }

  // Utility method for query parameters
  buildQuery(params) {
    const query = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        query.append(key, params[key]);
      }
    });
    return query.toString();
  }
}

export default BaseService;