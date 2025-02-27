import { create } from "zustand";
import axios from "axios";

// const API_URL = "http://localhost:8000/api/auth";
const API_URL = "https://vailovent.my.id/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  signin: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signin`, {
        username,
        password,
      });
      set({
        user: response.data.data,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing in",
        isLoading: false,
      });
      throw error;
    }
  },

  signout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/signout`);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing out",
        isLoading: false,
      });
      throw error;
    }
  },
}));
