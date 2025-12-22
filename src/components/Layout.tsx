import type { PropsWithChildren } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col bg-peppino-cream text-peppino-dark">
      <Navbar />

      {/* main ocupa el espacio disponible */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10">
        {children}
      </main>

      <Footer />
    </div>
  );
}