import { create } from "zustand";
import axios from "axios";

const API_URL = "http://54.242.107.79:8000/api/product";

export const useProductStore = create((set) => ({
  products: [],
  error: null,
  isLoading: false,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/all-products`);
      set({
        products: response.data.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data.message || "Error fetching products",
        isLoading: false,
      });
      throw error;
    }
  },
}));
