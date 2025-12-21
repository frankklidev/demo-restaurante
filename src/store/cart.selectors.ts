import type { RootState } from "./store";

export const selectCartItems = (state: RootState) =>
  Object.values(state.cart.itemsById);

export const selectCartCount = (state: RootState) =>
  Object.values(state.cart.itemsById).reduce((acc, it) => acc + it.qty, 0);

export const selectCartTotal = (state: RootState) =>
  Object.values(state.cart.itemsById).reduce(
    (acc, it) => acc + it.qty * it.product.price,
    0
  );