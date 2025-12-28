import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cart.slice";
import { saveCartState } from "./cart.persist";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

// Guardar cambios del carrito
store.subscribe(() => {
  const state = store.getState();
  saveCartState(state.cart);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;