import { useEffect, useRef, useCallback } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import { socketManager } from '@/lib/socket';

export const useSocket = (options = {}) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const socketRef = useRef(null);
  const cleanupFunctions = useRef([]);

  useEffect(() => {
    if (isAuthenticated) {
      socketRef.current = socketManager.connect();
    } else {
      socketManager.disconnect();
    }

    return () => {
      // Cleanup component-specific event listeners
      cleanupFunctions.current.forEach(cleanup => cleanup());
      cleanupFunctions.current = [];
      
      if (!isAuthenticated) {
        socketManager.disconnect();
      }
    };
  }, [isAuthenticated]);

  // Register component-specific event listener
  const addEventListener = useCallback((eventName, handler) => {
    if (socketManager.socket?.connected) {
      const cleanup = socketManager.addEventListener(eventName, handler);
      cleanupFunctions.current.push(cleanup);
      return cleanup;
    }
  }, []);

  const emit = useCallback((event, data) => {
    socketManager.emit(event, data);
  }, []);



  return {
    socket: socketRef.current,
    isConnected: socketManager.isConnected,
    emit,
    addEventListener,
  };
};