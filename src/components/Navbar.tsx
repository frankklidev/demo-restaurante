import { NavLink } from "react-router-dom";
import Image from "/logo_peppino.png";
import { FiShoppingCart, FiHome, FiGrid } from "react-icons/fi";
import { useAppSelector } from "../store/hooks";
import { selectCartCount } from "../store/cart.selectors";

export default function Navbar() {
  const cartCount = useAppSelector(selectCartCount);

  const linkBase =
    "relative rounded-full px-4 py-2.5 text-base font-semibold transition flex items-center gap-2";

  const linkClass = (isActive: boolean) =>
    [
      linkBase,
      isActive
        ? "bg-peppino-dark text-peppino-cream"
        : "text-peppino-dark hover:bg-peppino-cream/60",
    ].join(" ");

  return (
    <header className="sticky top-0 z-50 bg-peppino-light border-b border-peppino-dark">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        {/* Logo + marca */}
        <div className="flex items-center gap-3">
          <img
            src={Image}
            alt="Totò e Peppino"
            className="h-11 w-11 rounded-full bg-peppino-cream border border-peppino-dark"
          />

          {/* Texto móvil */}
          <div className="sm:hidden text-lg font-extrabold text-peppino-dark">
            Totò e Peppino
          </div>

          {/* Texto desktop */}
          <div className="hidden sm:block leading-tight">
            <div className="text-base font-extrabold tracking-wide text-peppino-dark">
              CATÁLOGO
            </div>
            <div className="text-sm font-medium text-peppino-dark/80">
              Productos italianos
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex items-center gap-2">
          <NavLink to="/" className={({ isActive }) => linkClass(isActive)}>
            <FiHome className="h-5 w-5" />
            <span className="hidden sm:inline">Inicio</span>
          </NavLink>

          <NavLink
            to="/catalogo"
            className={({ isActive }) => linkClass(isActive)}
          >
            <FiGrid className="h-5 w-5" />
            <span className="hidden sm:inline">Catálogo</span>
          </NavLink>

          <NavLink
            to="/carrito"
            aria-label="Carrito"
            className={({ isActive }) =>
              [linkClass(isActive), "px-3"].join(" ")
            }
          >
            <span className="relative inline-flex items-center">
              <FiShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-peppino-dark px-1 text-[11px] font-black text-peppino-cream border border-peppino-cream/60">
                  {cartCount}
                </span>
              )}
            </span>
            <span className="hidden sm:inline">Carrito</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}