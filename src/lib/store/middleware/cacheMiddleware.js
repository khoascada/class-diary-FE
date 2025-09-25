// ===================================================================
// lib/store/middleware/cacheMiddleware.js - Response Caching
// ===================================================================

// Simple in-memory cache for API responses
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const cacheMiddleware = (store) => (next) => (action) => {
  // Only cache successful GET requests
  if (action.type.endsWith('/fulfilled') && action.meta?.arg?.method === 'GET') {
    const cacheKey = `${action.type}_${JSON.stringify(action.meta.arg)}`;
    
    cache.set(cacheKey, {
      data: action.payload,
      timestamp: Date.now(),
    });
    
    // Clean up expired cache entries
    setTimeout(() => {
      if (cache.has(cacheKey)) {
        const entry = cache.get(cacheKey);
        if (Date.now() - entry.timestamp > CACHE_DURATION) {
          cache.delete(cacheKey);
        }
      }
    }, CACHE_DURATION);
  }
  
  return next(action);
};

// Helper function to get cached data
export const getCachedData = (actionType, args) => {
  const cacheKey = `${actionType}/fulfilled_${JSON.stringify(args)}`;
  const entry = cache.get(cacheKey);
  
  if (entry && Date.now() - entry.timestamp < CACHE_DURATION) {
    return entry.data;
  }
  
  return null;
};

export default cacheMiddleware;