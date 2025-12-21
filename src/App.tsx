import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Catalog from "./pages/Catalog";
import ProductDetail from "./components/ProductDetail";
import NotFound from "./components/NotFound";
import Cart from "./pages/Cart";


export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/producto/:slug" element={<ProductDetail />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Layout>
  );
}