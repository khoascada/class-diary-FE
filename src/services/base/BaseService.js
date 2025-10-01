import { apiAxios } from "@/lib/api";

class BaseService {
  constructor(baseURL = "") {
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
    return response.data?.data !== undefined ? response.data.data : response.data;
  }

  // Error handler
  handleError(error) {
    const { status, data } = error || {};

    throw {
      status,
      message: data?.message || this.getDefaultMessage(status),
      originalError: error,
    };
  }
  getDefaultMessage(status) {
    const defaults = {
      400: "Dữ liệu không hợp lệ",
      403: "Bạn không có quyền thực hiện",
      404: "Không tìm thấy dữ liệu",
      422: "Dữ liệu không hợp lệ",
      500: "Lỗi server",
    };
    return defaults[status] || "Đã có lỗi xảy ra";
  }

  // Utility method for query parameters
  buildQuery(params) {
    const query = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== "") {
        query.append(key, params[key]);
      }
    });
    return query.toString();
  }
}

export default BaseService;
