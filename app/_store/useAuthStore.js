import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

const useAuthStore = create((set) => ({
  user:
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('user'))
      : null, // Stores user details
  accessToken:
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null, // Stores the access token
  isAuthenticated:
    typeof window !== 'undefined'
      ? !!localStorage.getItem('accessToken')
      : false, // Tracks authentication status

  // Set user after login
  login: (userData, token) => {
    // const userData = jwtDecode(tok
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', token);
    set({
      user: userData,
      accessToken: token,
      isAuthenticated: true,
    });
  },

  // Logout and clear the store
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
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
}));

export default useAuthStore;
