import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CartPage from "../pages/CartPage";
import PaymentHistoryPage from "../pages/PaymentHistoryPage";
import SignInPage from "../pages/SignInPage";
import ProtectedRoute from "../components/ProtectRoute";
import PaymentStatus from "../pages/PaymentStatusPage";
import ProductList from "../pages/ProductListPage";

export default function RouterComponent() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/payment-status" element={<PaymentStatus />} />
      <Route path="/admin/signin" element={<SignInPage />} />

      {/* Protected Admin Routes */}
      <Route path="/admin">
        <Route
          path="transaction"
          element={
            <ProtectedRoute>
              <PaymentHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="transaction/:status"
          element={
            <ProtectedRoute>
              <PaymentHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="products"
          element={
            <ProtectedRoute>
              <ProductList />
            </ProtectedRoute>
          }
        />
        <Route
          path="products/:product_id"
          element={
            <ProtectedRoute>
              <ProductList />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all Route */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
