import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-10 text-center">
      <div className="text-5xl font-black">404</div>
      <p className="mt-3 text-zinc-400">Página no encontrada.</p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-2xl bg-zinc-200 px-5 py-3 text-sm font-black text-zinc-950"
      >
        Ir al inicio
      </Link>
    </div>
  );
}