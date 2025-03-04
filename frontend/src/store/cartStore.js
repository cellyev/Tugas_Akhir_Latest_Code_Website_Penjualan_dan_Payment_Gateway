import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set) => ({
      cart: [],

      setCart: (newCart) => {
        set({ cart: newCart });
      },

      clearCart: () => {
        set({ cart: [] });
      },

      addItemToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find((i) => i._id === item._id);

          let updatedCart;
          if (existingItem) {
            updatedCart = state.cart.map((i) =>
              i._id === item._id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            );
          } else {
            updatedCart = [...state.cart, item];
          }

          return { cart: updatedCart };
        }),

      removeItemFromCart: (itemId) =>
        set((state) => {
          const updatedCart = state.cart.filter((i) => i._id !== itemId);
          return { cart: updatedCart };
        }),
    }),
    {
      name: "cart-storage",
      getStorage: () => sessionStorage,
    }
  )
);
