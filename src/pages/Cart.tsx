import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectCartItems, selectCartTotal } from "../store/cart.selectors";
import { clearCart, decrement, addToCart, removeFromCart, setQty } from "../store/cart.slice";
import { formatMoney } from "../lib/format";

export default function Cart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);

  const currency = items[0]?.product.currency ?? "USD";
  const totalLabel = formatMoney(total, currency);

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-peppino-dark/10 bg-white p-10 text-center">
        <div className="text-2xl font-black text-peppino-dark">Tu carrito está vacío</div>
        <p className="mt-2 text-sm text-peppino-dark/70">
          Agrega productos desde el catálogo.
        </p>
        <Link
          to="/catalogo"
          className="mt-6 inline-flex rounded-2xl bg-peppino-dark px-6 py-3 text-sm font-black text-peppino-cream hover:opacity-90"
        >
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-peppino-dark/10 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-black text-peppino-dark">Carrito</h1>
          <button
            onClick={() => dispatch(clearCart())}
            className="rounded-2xl bg-peppino-light px-4 py-2 text-sm font-bold text-peppino-dark border border-peppino-dark/20 hover:opacity-90"
          >
            Vaciar
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-peppino-dark/10 bg-white p-6 space-y-4">
        {items.map(({ product, qty }) => {
          const lineTotal = product.price * qty;
          return (
            <div
              key={product.id}
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-peppino-dark/10 pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex items-center gap-4">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-16 w-16 rounded-2xl object-cover border border-peppino-dark/10"
                />
                <div>
                  <div className="font-extrabold text-peppino-dark">{product.name}</div>
                  <div className="text-sm text-peppino-dark/70">
                    {product.unit} · {formatMoney(product.price, product.currency)}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 justify-between sm:justify-end">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => dispatch(decrement({ productId: product.id }))}
                    className="h-10 w-10 rounded-2xl bg-peppino-cream border border-peppino-dark/20 font-black text-peppino-dark hover:opacity-90"
                  >
                    −
                  </button>

                  <input
                    value={qty}
                    onChange={(e) =>
                      dispatch(setQty({ productId: product.id, qty: Number(e.target.value || 0) }))
                    }
                    className="h-10 w-16 rounded-2xl border border-peppino-dark/20 text-center font-bold text-peppino-dark outline-none"
                    inputMode="numeric"
                  />

                  <button
                    onClick={() => dispatch(addToCart({ product, qty: 1 }))}
                    className="h-10 w-10 rounded-2xl bg-peppino-light border border-peppino-dark/20 font-black text-peppino-dark hover:opacity-90"
                  >
                    +
                  </button>
                </div>

                <div className="text-sm font-black text-peppino-dark">
                  {formatMoney(lineTotal, product.currency)}
                </div>

                <button
                  onClick={() => dispatch(removeFromCart({ productId: product.id }))}
                  className="rounded-2xl px-3 py-2 text-sm font-bold text-peppino-dark/80 hover:bg-peppino-light/60 border border-peppino-dark/10"
                >
                  Quitar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl border border-peppino-dark/10 bg-white p-6 flex items-center justify-between">
        <div className="text-sm text-peppino-dark/70">Total</div>
        <div className="text-2xl font-black text-peppino-dark">{totalLabel}</div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/catalogo"
          className="rounded-2xl bg-peppino-light px-6 py-3 text-sm font-black text-peppino-dark border border-peppino-dark/20 hover:opacity-90"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}