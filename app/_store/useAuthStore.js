import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Create a safer localStorage check
const getLocalStorage = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage;
  }
  return {
    getItem: () => null,
    setItem: () => null,
    removeItem: () => null,
  };
};

// Create store with persist middleware
const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      // Set user after login
      login: (userData, token) => {
        set({
          user: userData,
          accessToken: token,
          isAuthenticated: true,
        });
      },

      // Logout and clear the store
      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },

      // Update user details
      updateUser: (updatedUser) =>
        set((state) => ({
          user: { ...state.user, ...updatedUser },
        })),
    }),
    {
      name: 'auth-storage', // unique name
      getStorage: () => getLocalStorage(),
    }
  )
);

export default useAuthStore;
