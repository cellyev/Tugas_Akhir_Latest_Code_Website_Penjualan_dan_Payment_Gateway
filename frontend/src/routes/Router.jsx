import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CartPage from "../pages/CartPage";
import PaymentSuccessPage from "../pages/PaymentSuccessPage";
import PaymentFailedPage from "../pages/paymentFailedPage";
import PaymentHistoryPage from "../pages/PaymentHistoryPage";

export default function RouterComponent() {
  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/payment-success" element={<PaymentSuccessPage />} />
      <Route path="/payment-failed" element={<PaymentFailedPage />} />
      <Route path="/admin/transaction" element={<PaymentHistoryPage />} />
      <Route
        path="/admin/transaction/:status"
        element={<PaymentHistoryPage />}
      />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
