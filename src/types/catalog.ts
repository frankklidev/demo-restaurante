export type Category =
  | "Pastas"
  | "Aceites"
  | "Salsas"
  | "Quesos"
  | "Embutidos"
  | "Dulces";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  currency: "USD" | "EUR" | "CUP";
  unit: string; // "500g", "1L", etc.
  origin: string; // "Italia", "Parma, Italia"
  shortDescription: string;
  description: string;
  ingredients?: string;
  imageUrl: string; // puede ser URL o /assets/...
  featured?: boolean;
};