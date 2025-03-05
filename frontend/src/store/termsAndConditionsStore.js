import axios from "axios";
import { create } from "zustand";

// const API_URL = "https://vailovent.my.id/api/v1/termsAndConditions";
const API_URL = "http://localhost:8000/api/v1/termsAndConditions";

export const useTermsAndConditionsStore = create((set) => ({
  termsAndConditions: [],
  error: null,
  isLoading: false,

  fetchTermsAndConditions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(API_URL);
      set({
        termsAndConditions: response.data.data,
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
