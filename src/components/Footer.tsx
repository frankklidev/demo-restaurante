export default function Footer() {
  return (
    <footer className="border-t border-peppino-dark/20 bg-peppino-light">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-peppino-dark">
            © {new Date().getFullYear()} Catálogo Peppino
          </p>

          <p className="text-sm text-peppino-dark/80">
            Productos italianos auténticos · Pedido por WhatsApp
          </p>
        </div>
      </div>
    </footer>
  );
}