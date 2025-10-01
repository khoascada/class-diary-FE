// Custom logger middleware for development
const loggerMiddleware = (store) => (next) => (action) => {
  // Only log in development
  if (process.env.NODE_ENV !== 'development') {
    return next(action);
  }

  const startTime = Date.now();
  const prevState = store.getState();

  // console.group(`🚀 Action: ${action.type}`);
  // console.log('📥 Payload:', action.payload);
  // console.log('📊 Previous State:', prevState);

  // Execute action
  const result = next(action);

  const nextState = store.getState();
  const duration = Date.now() - startTime;

  // console.log('📤 Next State:', nextState);
  // console.log(`⏱️ Duration: ${duration}ms`);
  console.groupEnd();

  return result;
};

export default loggerMiddleware;
