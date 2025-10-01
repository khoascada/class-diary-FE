import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  sidebarOpen: false,
  theme: 'light',
  notifications: [],
  modals: {
    loginModal: false,
    profileModal: false,
  },
  loading: {
    global: false,
    components: {},
  },
};
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    toggleModal: (state, action) => {
      const { modalName, isOpen } = action.payload;
      state.modals[modalName] = isOpen;
    },
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    setComponentLoading: (state, action) => {
      const { component, loading } = action.payload;
      state.loading.components[component] = loading;
    },
    clearAllData: (state) => {
      return {
        ...initialState,
        theme: state.theme, // Keep user's theme preference
      };
    },
    initializeUIPreferences: (state) => {
      const uiPreferences = JSON.parse(localStorage.getItem('uiPreferences'));
      if (uiPreferences) {
        state.theme = uiPreferences.theme;
        state.sidebarOpen = uiPreferences.sidebarOpen;
      }
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  addNotification,
  removeNotification,
  toggleModal,
  setGlobalLoading,
  setComponentLoading,
  clearAllData,
  initializeUIPreferences,
} = uiSlice.actions;

export default uiSlice.reducer;
