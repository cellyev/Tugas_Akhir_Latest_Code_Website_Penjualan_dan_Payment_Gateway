import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CartPage from "../pages/CartPage";
import PaymentHistoryPage from "../pages/PaymentHistoryPage";
import SignInPage from "../pages/SignInPage";
import ProtectedRoute from "../components/ProtectRoute";
import PaymentStatus from "../pages/PaymentStatusPage";

export default function RouterComponent() {
  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/payment-status" element={<PaymentStatus />} />
      <Route path="/admin/signin" element={<SignInPage />} />

      <Route
        path="/admin/transaction"
        element={
          <ProtectedRoute>
            <PaymentHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/transaction/:status"
        element={
          <ProtectedRoute>
            <PaymentHistoryPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
