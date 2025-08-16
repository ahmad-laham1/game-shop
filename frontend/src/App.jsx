import { Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./auth/RequireAuth";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Receipt from "./pages/Receipt";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} /> {/* public route */}
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/receipt/:id" element={<Receipt />} />
      </Route>
      <Route path="/" element={<Navigate to="/products" replace />} />
      <Route
        path="*"
        element={<NotFound message="This page does not exist." />}
      />
    </Routes>
  );
}
