import type { Product } from "../types/catalog";

export type CartItem = {
  product: Product;
  qty: number;
};

export type CartState = {
  itemsById: Record<string, CartItem>;
};