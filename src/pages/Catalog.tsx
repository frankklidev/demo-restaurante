import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import CategoryPills from "../components/CategoryPills";
import { CATEGORIES, products } from "../data/products";
import type { Category } from "../types/catalog";

export default function Catalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "Todas">("Todas");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products
      .filter((p) => (category === "Todas" ? true : p.category === category))
      .filter((p) => {
        if (!q) return true;
        const haystack =
          `${p.name} ${p.category} ${p.origin} ${p.shortDescription}`.toLowerCase();
        return haystack.includes(q);
      });
  }, [query, category]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-white border border-peppino-dark/10 p-6">
        <h1 className="text-3xl font-black text-peppino-dark">Catálogo</h1>
        <p className="mt-2 text-base text-peppino-dark/80">
          Busca productos, filtra por categoría y abre el detalle para pedir por WhatsApp.
        </p>
      </div>

      {/* Search */}
      <div className="rounded-3xl bg-white border border-peppino-dark/10 p-5">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {/* Categories */}
      <div className="rounded-3xl bg-white border border-peppino-dark/10 p-5">
        <CategoryPills categories={CATEGORIES} value={category} onChange={setCategory} />
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm text-peppino-dark/80">
          Mostrando{" "}
          <span className="font-black text-peppino-dark">{filtered.length}</span>{" "}
          productos
        </span>

        {category !== "Todas" ? (
          <span className="inline-flex items-center rounded-full bg-peppino-light px-4 py-2 text-sm font-bold text-peppino-dark border border-peppino-dark/20">
            {category}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-bold text-peppino-dark/70 border border-peppino-dark/10">
            Todas las categorías
          </span>
        )}
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-peppino-dark/10 bg-white p-10 text-center">
          <div className="text-xl font-black text-peppino-dark">
            No hay resultados
          </div>
          <p className="mt-2 text-sm text-peppino-dark/80">
            Prueba con otra palabra o cambia la categoría.
          </p>
          <button
            onClick={() => {
              setQuery("");
              setCategory("Todas");
            }}
            className="mt-6 rounded-2xl bg-peppino-dark px-5 py-3 text-sm font-black text-peppino-cream hover:opacity-90"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}