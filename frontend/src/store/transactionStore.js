import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "https://vailovent.my.id/api/v1/transactions";
const MIDTRANS_URL =
  "https://vailovent.my.id/api/v1/midtrans/create-transaction";

// const API_URL = "http://localhost:8000/api/v1/transactions";
// const MIDTRANS_URL = "http://localhost:8000/api/v1/midtrans/create-transaction";

export const useTransactionStore = create((set, get) => ({
  table_code: "",
  customer_name: "",
  customer_email: "",
  products: [],
  transactionDetails: null,
  payment_link: null,
  error: null,
  isLoading: false,

  setTransactionDetails: (details) =>
    set((state) => ({ ...state, ...details })),

  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),

  createTransaction: async () => {
    set({ isLoading: true, error: null });
    try {
      const { table_code, customer_name, customer_email, products } = get();
      if (
        !table_code ||
        !customer_name ||
        !customer_email ||
        products.length === 0
      ) {
        throw new Error(
          "Please complete all required fields before proceeding."
        );
      }

      const response = await axios.post(`${API_URL}/create`, {
        table_code,
        customer_name,
        customer_email,
        products,
      });

      const savedTransaction = response?.data?.data;
      if (!savedTransaction || !savedTransaction._id) {
        throw new Error("Transaction data is invalid or missing _id");
      }

      const transaction_id = savedTransaction._id.toString();
      const midtransResponse = await axios.post(MIDTRANS_URL, {
        customer_name,
        customer_email,
        products,
        transaction_id,
      });

      const redirect_url = midtransResponse?.data?.redirect_url;
      if (!redirect_url) {
        throw new Error("Redirect URL not found in Midtrans response");
      }

      set({
        transactionDetails: savedTransaction,
        payment_link: redirect_url,
        isLoading: false,
      });
      return { savedTransaction, redirect_url };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create transaction!";
      toast.error(errorMessage);
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  paying: async (transaction_id, status) => {
    set({ isLoading: true, error: null });

    try {
      if (!transaction_id || !status) {
        throw new Error("Transaction ID and status are required!");
      }

      const response = await axios.put(
        `${API_URL}/${transaction_id}/payment/${status}`
      );

      if (!response?.data) {
        throw new Error("Invalid response format");
      }

      const { success, message, data, items } = response.data;

      if (!success) {
        throw new Error(message || "Failed to update transaction");
      }

      set({
        transactionDetails: data,
        items: items || [],
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      console.error("Error in paying API: ", error); // Tambahkan log untuk lebih jelas
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error processing payment";
      toast.error(errorMessage);
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  fetchTransaction: async (transaction_id) => {
    set({ isLoading: true, error: null });

    try {
      if (!transaction_id) {
        throw new Error("Order ID and status are required!");
      }

      const response = await axios.get(`${API_URL}/${transaction_id}`);

      if (!response?.data) {
        throw new Error("Invalid response format");
      }

      const { success, data, message } = response.data;

      if (!success) {
        throw new Error(message || "Failed to fetch transactions");
      }

      set({ transactions: data, isLoading: false });
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error fetching transactions";
      toast.error(errorMessage);
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  clearTransactions: () => set({ transactions: [] }),

  fetchAllTransactionByStatus: async (status) => {
    set({ isLoading: true, error: null });

    try {
      if (!status) {
        throw new Error("Status is required!");
      }

      const response = await axios.get(`${API_URL}/status/${status}`);
      if (!response?.data) {
        throw new Error("Invalid response format");
      }

      const { success, message, data } = response.data;

      if (!success) {
        throw new Error(message || "Failed to fetch transactions");
      }

      set({
        transactions: data.Transactions,
        transactionItems: data.TransactionItems,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error fetching transactions";
      toast.error(errorMessage);
      set({ error: errorMessage, isLoading: false });
      // throw error;
    }
  },
}));
