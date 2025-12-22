import type { Product } from "../types/catalog";
import Aceite from '../assets/images/aceite.jpg'
import Penne from '../assets/images/penne.jpg'
import Salsa from '../assets/images/salsa.jpg'
import Prosciutto from '../assets/images/prosciutto.jpg'
import Biscotti from '../assets/images/biscotti.jpg'


export const RESTAURANT_NAME = "Trattoria Demo";
export const WHATSAPP_PHONE = "+5355555555"; // <-- cambia aquí

export const CATEGORIES = [
  "Pastas",
  "Aceites",
  "Salsas",
  "Quesos",
  "Embutidos",
  "Dulces",
] as const;

export const products: Product[] = [
  {
    id: "p1",
    slug: "spaghetti-di-grano-duro-500g",
    name: "Spaghetti di Grano Duro",
    category: "Pastas",
    price: 6.5,
    currency: "USD",
    unit: "500g",
    origin: "Italia",
    shortDescription: "Pasta italiana clásica, perfecta para carbonara y pomodoro.",
    description:
      "Spaghetti de sémola de trigo duro, textura firme y cocción uniforme. Ideal para recetas tradicionales italianas.",
    ingredients: "Sémola de trigo duro, agua.",
    imageUrl:
      "https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=1400&q=80",
    featured: true,
  },
  {
    id: "p2",
    slug: "penne-rigate-500g",
    name: "Penne Rigate",
    category: "Pastas",
    price: 6.9,
    currency: "USD",
    unit: "500g",
    origin: "Italia",
    shortDescription: "Ideal para salsas cremosas: pesto, alfredo, 4 quesos.",
    description:
      "Penne con estrías para atrapar mejor la salsa. Perfecta para platos al horno o salsas densas.",
    imageUrl:Penne,
  },
  {
    id: "p3",
    slug: "aceite-oliva-extra-virgen-750ml",
    name: "Aceite de Oliva Extra Virgen",
    category: "Aceites",
    price: 14.9,
    currency: "USD",
    unit: "750ml",
    origin: "Toscana, Italia",
    shortDescription: "Frutado, elegante y perfecto para ensaladas y bruschetta.",
    description:
      "AOVE de primera extracción, sabor equilibrado con notas verdes. Úsalo en crudo para elevar cualquier plato.",
    imageUrl:Aceite,
    featured: true,
  },
  {
    id: "p4",
    slug: "salsa-pomodoro-370g",
    name: "Salsa Pomodoro",
    category: "Salsas",
    price: 5.5,
    currency: "USD",
    unit: "370g",
    origin: "Italia",
    shortDescription: "Tomate italiano, simple y auténtica para pasta o pizza.",
    description:
      "Salsa de tomate estilo italiano, lista para calentar y servir. Base ideal para recetas caseras.",
    imageUrl:Salsa,
  },
  {
    id: "p5",
    slug: "parmigiano-reggiano-200g",
    name: "Parmigiano Reggiano",
    category: "Quesos",
    price: 12.9,
    currency: "USD",
    unit: "200g",
    origin: "Parma, Italia",
    shortDescription: "Curación tradicional. Potente, salino, perfecto para rallar.",
    description:
      "Queso duro italiano con maduración tradicional. Úsalo en pastas, risottos o tablas de quesos.",
    imageUrl:
      "https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format&fit=crop&w=1400&q=80",
    featured: true,
  },
  {
    id: "p6",
    slug: "prosciutto-150g",
    name: "Prosciutto (loncheado)",
    category: "Embutidos",
    price: 10.5,
    currency: "USD",
    unit: "150g",
    origin: "Italia",
    shortDescription: "Suave, delicado y perfecto con pan, melón o burrata.",
    description:
      "Jamón curado italiano, loncheado fino. Ideal para antipasti y tablas.",
    imageUrl:Prosciutto,
  },
  {
    id: "p7",
    slug: "biscotti-almendra-250g",
    name: "Biscotti de Almendra",
    category: "Dulces",
    price: 7.9,
    currency: "USD",
    unit: "250g",
    origin: "Italia",
    shortDescription: "Crujientes, perfectos para café o vin santo.",
    description:
      "Galletas italianas horneadas dos veces, textura crujiente y sabor intenso a almendra.",
    imageUrl:Biscotti,
  },
];