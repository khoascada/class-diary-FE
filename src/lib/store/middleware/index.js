import loggerMiddleware from "./loggerMiddleware";
import errorMiddleware from "./errorMiddleware";
import persistMiddleware from "./persistMiddleware";
import analyticsMiddleware from "./analyticsMiddleware";
import cacheMiddleware from "./cacheMiddleware";
import { authListenerMiddleware } from "./authMiddleware";

// Export all middleware
export {
  loggerMiddleware,
  errorMiddleware,
  persistMiddleware,
  analyticsMiddleware,
  cacheMiddleware,
  authListenerMiddleware,
};

// Default middleware configuration
export const getDefaultMiddleware = (getDefaultMiddleware) => {
  return getDefaultMiddleware({
    serializableCheck: {
      // Những action này sẽ được bỏ qua kiểm tra serializable
      // Redux Toolkit sẽ không cảnh báo nếu payload của các action này không thể chuyển thành JSON
      ignoredActions: [
        "persist/PERSIST", // Redux Persist dùng để lưu state; payload có thể chứa object không serializable
        "persist/REHYDRATE", // Redux Persist rehydrate state từ storage
        "auth/loginUser/fulfilled", // Async action login có payload phức tạp (token, session object...)
      ],
      // bỏ qua kiểm tra serializable
      ignoredPaths: [
        "socket", // instance WebSocket hoặc socket.io, không serializable
        "auth.lastActivity", // có thể là Date object hoặc thứ không serializable khác
      ],
    },

    // immuatable: state ko đc sửa trực tiếp
    immutableCheck: {
      // mutate trực tiếp mà RTK sẽ không cảnh báo
      ignoredPaths: [
        "socket", // object mutable như socket, có thể gán .emit, .on...
      ],
    },
  })
    .concat(errorMiddleware) // Handle errors first
    .concat(persistMiddleware) // Then persist state
    .concat(analyticsMiddleware) // Track actions
    .concat(cacheMiddleware) // Cache responses
    .concat(process.env.NODE_ENV === "development" ? loggerMiddleware : [])
    .prepend(authListenerMiddleware.middleware);
};
