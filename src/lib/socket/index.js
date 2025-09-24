import { io } from "socket.io-client";
import { store } from "../store";
import { addNotification } from "../store/slices/uiSlice";

// Quản lý socket tập trung
class SocketManager {
  constructor() {
    this.socket = null; // Socket instance
    this.isConnected = false; // Trạng thái kết nối
    this.reconnectAttempts = 0; // Đếm số lần thử reconnect
    this.maxReconnectAttempts = 5; // Giới hạn số lần reconnect
    this.eventHandlers = new Map();
  }

  // Kết nối socket đến server
  connect() {
    if (this.socket?.connected) return this.socket;

    const token = sessionStorage.getItem("accessToken"); // Lấy token từ sessionStorage

    // Tạo kết nối socket
    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      auth: { token }, // Gửi token kèm theo để server auth
      transports: ["websocket", "polling"], // Ưu tiên websocket
      timeout: 20000, // timeout 20s
      reconnection: true, // bật reconnect
      reconnectionDelay: 1000, // delay lần đầu 1s
      reconnectionDelayMax: 5000, // delay max 5s
      maxReconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventListeners(); // Setup listener
    return this.socket;
  }

  // Setup các sự kiện mặc định + custom
  setupEventListeners() {
    // Khi kết nối thành công
    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;

      // Hiển thị thông báo lên UI
      store.dispatch(
        addNotification({
          type: "success",
          message: "Connected to server",
          duration: 2000,
        })
      );
    });

    // Khi mất kết nối
    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      this.isConnected = false;

      if (reason === "io server disconnect") {
        // Nếu server chủ động ngắt -> cần gọi connect() lại
        this.socket.connect();
      }
    });

    // Khi lỗi kết nối
    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      this.reconnectAttempts++;

      // Nếu reconnect quá số lần cho phép -> thông báo lỗi
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        store.dispatch(
          addNotification({
            type: "error",
            message: "Failed to connect to server",
            duration: 5000,
          })
        );
      }
    });

    // ====== CUSTOM EVENTS ======

    // Khi nhận được notification từ server
    this.socket.on("notification", (data) => {
      store.dispatch(
        addNotification({
          type: data.type || "info",
          message: data.message,
          duration: data.duration || 4000,
        })
      );
    });

    // Khi server gửi update user
    this.socket.on("user_update", (userData) => {
      console.log("User update received:", userData);
      // TODO: Có thể dispatch store để cập nhật user state
    });

    // Khi nhận data mới - cái này sẽ update thẳng trên component mà ko qua redux
    this.socket.on("live_update", (data) => {

      this.handleData(data);


      // phát dữ liệu đến tất cả component đã đăng ký listener "live_update"
      const handlers = this.eventHandlers.get("live_update");
      if (handlers) {
        handlers.forEach((handler) => handler(data));
      }
    });
  }

  handleData(data) {
    // Do something với data ở dạng ngầm như là lưu vào redux,...
  }

  // Allow components to register for specific events
  addEventListener(eventName, handler) {
    if (!this.eventHandlers.has(eventName)) {
      this.eventHandlers.set(eventName, new Set());
    }
    this.eventHandlers.get(eventName).add(handler);
    
    return () => {
      // Return cleanup function
      this.removeEventListener(eventName, handler);
    };
  }

  removeEventListener(eventName, handler) {
    const handlers = this.eventHandlers.get(eventName);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.eventHandlers.delete(eventName);
      }
    }
  }



  // Gửi event tới server
  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn("Socket not connected, event not sent:", event);
    }
  }

  // Ngắt kết nối
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

// Export 1 instance duy nhất
export const socketManager = new SocketManager();
