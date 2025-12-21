import { Link } from "react-router-dom";
import { formatMoney } from "../lib/format";
import type { Product } from "../types/catalog";
import { useAppDispatch } from "../store/hooks";
import { addToCart } from "../store/cart.slice";

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  const price = formatMoney(product.price, product.currency);
  const dispatch = useAppDispatch();

  return (
    <Link
      to={`/producto/${product.slug}`}
      className="group overflow-hidden rounded-3xl border border-peppino-dark/10 bg-white transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 rounded-full bg-peppino-light px-3 py-1 text-xs font-bold text-peppino-dark border border-peppino-dark/20">
          {product.category}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold leading-snug text-peppino-dark">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-peppino-dark/70">{product.origin}</p>
          </div>

          <div className="rounded-2xl bg-peppino-dark px-3 py-2 text-sm font-black text-peppino-cream">
            {price}
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-peppino-dark/80">
          {product.shortDescription}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-xs text-peppino-dark/70">
            Presentación: {product.unit}
          </span>

          <button
            onClick={(e) => {
              e.preventDefault();
              dispatch(addToCart({ product, qty: 1 }));
            }}
            className="rounded-2xl bg-peppino-light px-4 py-2 text-sm font-black text-peppino-dark border border-peppino-dark/20 hover:opacity-90"
          >
            + Agregar
          </button>
        </div>
      </div>
    </Link>
  );
}