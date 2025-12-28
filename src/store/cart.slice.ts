import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../types/catalog";
import type { CartState } from "./cart.types";
import { loadCartState } from "./cart.persist";

const initialState: CartState =
  loadCartState() ?? {
    itemsById: {},
  };

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; qty?: number }>) => {
      const { product, qty = 1 } = action.payload;
      const existing = state.itemsById[product.id];
      if (existing) existing.qty += qty;
      else state.itemsById[product.id] = { product, qty };
    },

    decrement: (state, action: PayloadAction<{ productId: string }>) => {
      const item = state.itemsById[action.payload.productId];
      if (!item) return;
      item.qty -= 1;
      if (item.qty <= 0) delete state.itemsById[action.payload.productId];
    },

    setQty: (state, action: PayloadAction<{ productId: string; qty: number }>) => {
      const { productId, qty } = action.payload;
      if (qty <= 0) {
        delete state.itemsById[productId];
        return;
      }
      const item = state.itemsById[productId];
      if (item) item.qty = qty;
    },

    removeFromCart: (state, action: PayloadAction<{ productId: string }>) => {
      delete state.itemsById[action.payload.productId];
    },

    clearCart: (state) => {
      state.itemsById = {};
    },
  },
});

export const { addToCart, decrement, setQty, removeFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;