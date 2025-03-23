import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null, // Stores user details
  accessToken: null, // Stores the access token
  isAuthenticated: false, // Tracks authentication status

  // Set user after login
  login: (userData, token) =>
    set({
      user: userData,
      accessToken: token,
      isAuthenticated: true,
    }),

  // Logout and clear the store
  logout: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    }),

  // Update user details
  updateUser: (updatedUser) =>
    set((state) => ({
      user: { ...state.user, ...updatedUser },
    })),
}));

export default useAuthStore;
