import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "https://vailovent.my.id/api/v1/products";
// const API_URL = "http://localhost:8000/api/v1/products";

export const useProductStore = create((set, get) => ({
  products: [],
  error: null,
  isLoading: false,

  createProduct: async (productData, file) => {
    set({ isLoading: true, error: null });
    try {
      const { name, description, stock, price } = productData;

      if (!name || !description || !stock || !price || !file) {
        throw new Error(
          "Please complete all required fields before proceeding!"
        );
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("stock", stock);
      formData.append("price", price);
      formData.append("image", file);

      const response = await axios.post(`${API_URL}/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newProduct = response?.data?.data;
      if (!newProduct?._id) {
        throw new Error("Failed to create product: Invalid response data!");
      }

      set((state) => ({
        products: [...state.products, newProduct],
        isLoading: false,
      }));

      toast.success(response?.data?.message || "Product created successfully!");
      return newProduct;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create product!";
      toast.error(errorMessage);
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateProduct: async (product_id, productData, file) => {
    if (!product_id) throw new Error("Product ID is required for update");
    set({ isLoading: true, error: null });

    try {
      const { name, description, stock, price, image } = productData;

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("stock", stock);
      formData.append("price", price);

      // Handle image - jika ada file baru, gunakan itu, jika tidak gunakan URL yang ada
      if (file) {
        formData.append("image", file);
      } else if (image && typeof image === "string") {
        formData.append("imageUrl", image);
      }

      const response = await axios.put(
        `${API_URL}/update/${product_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedProduct = response?.data?.data;
      if (!updatedProduct?._id) {
        throw new Error("Failed to update product: Invalid response data!");
      }

      set((state) => ({
        products: state.products.map((p) =>
          p._id === product_id ? updatedProduct : p
        ),
        isLoading: false,
      }));

      toast.success(response?.data?.message || "Product updated successfully!");
      return updatedProduct;
    } catch (error) {
      let errorMessage = "Failed to update product!";

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          (error.response.status === 413
            ? "Image too large (max 10MB)"
            : error.message);
      }

      toast.error(errorMessage);
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  deleteProduct: async (product_id) => {
    if (!product_id) throw new Error("Product ID is required for deletion!");
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(`${API_URL}/delete/${product_id}`);

      const filteredProducts = (get().products || []).filter(
        (product) => product._id !== product_id
      );

      set({
        products: filteredProducts,
        isLoading: false,
        successMessage: response?.data?.message,
      });

      toast.success(response?.data?.message);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete product!";
      toast.error(errorMessage);
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}`);
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

  fetchProductsAdmin: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/all-admin`);
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
