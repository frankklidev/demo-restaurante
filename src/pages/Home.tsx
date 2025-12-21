import { Link } from "react-router-dom";
import { products, RESTAURANT_NAME } from "../data/products";

export default function Home() {
  const featured = products.filter((p) => p.featured).slice(0, 6);

  return (
    <div className="space-y-12">
      {/* HERO */}
      <section className="overflow-hidden rounded-3xl border border-peppino-dark/10 bg-white">
        <div className="grid gap-10 p-8 md:grid-cols-2 md:items-center">
          {/* Texto */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-peppino-light px-4 py-2 text-sm font-bold text-peppino-dark border border-peppino-dark/20">
              🇮🇹 Productos italianos auténticos
            </div>

            <h1 className="mt-5 text-3xl font-black leading-tight text-peppino-dark md:text-4xl">
              Catálogo premium para vender por WhatsApp
            </h1>

            <p className="mt-4 text-base text-peppino-dark/80">
              Selección de productos italianos para disfrutar en casa. Compra
              fácil y rápida desde <span className="font-semibold">{RESTAURANT_NAME}</span>.
            </p>

            <div className="mt-7 flex flex-wrap gap-4">
              <Link
                to="/catalogo"
                className="rounded-2xl bg-peppino-dark px-6 py-3 text-base font-black text-peppino-cream hover:opacity-90"
              >
                Ver catálogo
              </Link>

              <a
                href="#destacados"
                className="rounded-2xl border border-peppino-dark/30 px-6 py-3 text-base font-bold text-peppino-dark hover:bg-peppino-light/60"
              >
                Ver destacados
              </a>
            </div>
          </div>

          {/* Card info */}
          <div className="relative">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-peppino-light/40 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-peppino-light/40 blur-2xl" />

            <div className="relative rounded-3xl border border-peppino-dark/10 bg-white p-6">
              <p className="text-sm font-black text-peppino-dark">
                Demo listo para vender:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-peppino-dark/80">
                <li>✅ Categorías claras</li>
                <li>✅ Buscador rápido</li>
                <li>✅ Detalle de producto</li>
                <li>✅ Pedido directo por WhatsApp</li>
                <li>✅ Diseño premium (mobile-first)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* DESTACADOS */}
      <section id="destacados" className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-peppino-dark">
              Destacados
            </h2>
            <p className="text-sm text-peppino-dark/70">
              Los productos más atractivos para vender rápido.
            </p>
          </div>

          <Link
            to="/catalogo"
            className="text-sm font-bold text-peppino-dark hover:underline"
          >
            Ver todo →
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <div
              key={p.id}
              className="overflow-hidden rounded-3xl border border-peppino-dark/10 bg-white"
            >
              <img
                src={p.imageUrl}
                alt={p.name}
                className="aspect-4/3 w-full object-cover"
                loading="lazy"
              />

              <div className="p-5">
                <div className="text-xs font-bold text-peppino-dark/70">
                  {p.category}
                </div>

                <div className="mt-1 text-lg font-extrabold text-peppino-dark">
                  {p.name}
                </div>

                <div className="mt-4">
                  <Link
                    to={`/producto/${p.slug}`}
                    className="inline-flex rounded-2xl bg-peppino-light px-4 py-2 text-sm font-black text-peppino-dark border border-peppino-dark/20 hover:opacity-90"
                  >
                    Ver detalle
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}