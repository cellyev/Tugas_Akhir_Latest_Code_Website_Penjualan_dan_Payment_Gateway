import axios from "axios";
import { create } from "zustand";

const API_URL = "http://54.242.107.79:8000/api/termsAndConditions";

export const useTermsAndConditionsStore = create((set) => ({
  termsAndConditions: [], // Default empty array agar tidak error
  error: null,
  isLoading: false,

  fetchTermsAndConditions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(API_URL);
      set({
        termsAndConditions: response.data.data, // Pastikan mengambil data yang benar
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching terms and conditions:", error);
      set({
        error:
          error.response?.data.message || "Error fetching terms and conditions",
        isLoading: false,
      });
    }
  },
}));
