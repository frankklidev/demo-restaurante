import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { products, RESTAURANT_NAME, WHATSAPP_PHONE } from "../data/products";
import { formatMoney } from "../lib/format";
import { buildWhatsAppLink, productWhatsAppMessage } from "../lib/whatsapp";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();

  const product = useMemo(() => {
    return products.find((p) => p.slug === slug);
  }, [slug]);

  if (!product) {
    return (
      <div className="rounded-3xl border border-peppino-dark/10 bg-white p-10">
        <h1 className="text-2xl font-black text-peppino-dark">
          Producto no encontrado
        </h1>
        <p className="mt-2 text-peppino-dark/70">
          Puede que el enlace esté mal o el producto ya no exista.
        </p>

        <Link
          to="/catalogo"
          className="mt-6 inline-flex rounded-2xl bg-peppino-dark px-5 py-3 text-sm font-black text-peppino-cream hover:opacity-90"
        >
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const priceLabel = formatMoney(product.price, product.currency);

  const waMsg = productWhatsAppMessage({
    productName: product.name,
    unit: product.unit,
    priceLabel,
    restaurantName: RESTAURANT_NAME,
  });

  const waLink = buildWhatsAppLink(WHATSAPP_PHONE, waMsg);

  return (
    <div className="space-y-8">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/catalogo"
          className="text-sm font-bold text-peppino-dark hover:underline"
        >
          ← Volver
        </Link>

        <div className="rounded-full bg-peppino-light px-4 py-2 text-xs font-bold text-peppino-dark border border-peppino-dark/20">
          {product.category}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Imagen */}
        <div className="overflow-hidden rounded-3xl border border-peppino-dark/10 bg-white">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="aspect-4/3 w-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div className="rounded-3xl border border-peppino-dark/10 bg-white p-6">
            <h1 className="text-3xl font-black leading-tight text-peppino-dark">
              {product.name}
            </h1>
            <p className="mt-2 text-peppino-dark/70">{product.origin}</p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="rounded-2xl bg-peppino-dark px-4 py-2 text-base font-black text-peppino-cream">
                {priceLabel}
              </div>

              <div className="rounded-2xl border border-peppino-dark/20 bg-peppino-cream px-4 py-2 text-sm font-bold text-peppino-dark">
                Presentación: {product.unit}
              </div>
            </div>

            <p className="mt-5 text-peppino-dark/80">{product.description}</p>
          </div>

          {/* Ingredientes */}
          {product.ingredients ? (
            <div className="rounded-3xl border border-peppino-dark/10 bg-white p-6">
              <div className="text-sm font-black text-peppino-dark">
                Ingredientes
              </div>
              <p className="mt-2 text-sm text-peppino-dark/80">
                {product.ingredients}
              </p>
            </div>
          ) : null}

          {/* CTA */}
          <div className="rounded-3xl border border-peppino-dark/10 bg-white p-6">
            <div className="text-sm font-black text-peppino-dark">Pedir ahora</div>
            <p className="mt-2 text-sm text-peppino-dark/70">
              Te abrimos WhatsApp con el mensaje listo para enviar.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-peppino-dark px-6 py-3 text-sm font-black text-peppino-cream hover:opacity-90"
              >
                Pedir por WhatsApp
              </a>

              <Link
                to="/catalogo"
                className="rounded-2xl border border-peppino-dark/20 bg-peppino-light px-6 py-3 text-sm font-bold text-peppino-dark hover:opacity-90"
              >
                Seguir mirando
              </Link>
            </div>

            <details className="mt-5 rounded-2xl border border-peppino-dark/15 bg-peppino-cream p-4">
              <summary className="cursor-pointer text-sm font-bold text-peppino-dark">
                Ver mensaje que se enviará
              </summary>
              <pre className="mt-3 whitespace-pre-wrap text-xs text-peppino-dark/80">
                {waMsg}
              </pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}