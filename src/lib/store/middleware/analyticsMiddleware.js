
// Thống kê hành vi người dùng
const analyticsMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Only track in production
  if (process.env.NODE_ENV !== 'production' || typeof window === 'undefined') {
    return result;
  }
  
  // Define trackable actions
  const trackableActions = {
    'auth/loginUser/fulfilled': {
      event: 'user_login',
      properties: (action) => ({
        method: 'email',
        user_id: action.payload.user.id,
      }),
    },
    'post/createPost/fulfilled': {
      event: 'post_created',
      properties: (action) => ({
        post_id: action.payload.id,
        post_type: action.payload.type,
      }),
    },
    'ui/setTheme': {
      event: 'theme_changed',
      properties: (action) => ({
        theme: action.payload,
      }),
    },
    'user/updateProfile/fulfilled': {
      event: 'profile_updated',
      properties: (action) => ({
        user_id: action.payload.id,
      }),
    },
  };
  
  const trackConfig = trackableActions[action.type];
  if (trackConfig) {
    try {
      const properties = trackConfig.properties ? trackConfig.properties(action) : {};
      
      // Google Analytics
      if (window.gtag) {
        window.gtag('event', trackConfig.event, properties);
      }
      
      // Facebook Pixel
      if (window.fbq) {
        window.fbq('track', trackConfig.event, properties);
      }
      
      // Custom analytics service
      if (window.analytics) {
        window.analytics.track(trackConfig.event, properties);
      }
      
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }
  
  return result;
};

export default analyticsMiddleware;