import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CartPage from "../pages/CartPage";
import PaymentSuccessPage from "../pages/PaymentSuccessPage";
import PaymentFailedPage from "../pages/paymentFailedPage";
import PaymentHistoryPage from "../pages/PaymentHistoryPage";
import SignInPage from "../pages/SignInPage";
import ProtectedRoute from "../components/ProtectRoute";

export default function RouterComponent() {
  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/payment-success" element={<PaymentSuccessPage />} />
      <Route path="/payment-failed" element={<PaymentFailedPage />} />
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
