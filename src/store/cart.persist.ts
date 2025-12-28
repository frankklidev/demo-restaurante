import type { CartState } from "./cart.types";

const KEY = "peppino_cart_v1";

export function loadCartState(): CartState | undefined {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as CartState;

    // Validación mínima
    if (!parsed || typeof parsed !== "object") return undefined;
    if (!parsed.itemsById || typeof parsed.itemsById !== "object") return undefined;

    return parsed;
  } catch {
    return undefined;
  }
}

export function saveCartState(state: CartState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore (storage full / blocked)
  }
}