import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

/**
 * ProtectedRoute — memverifikasi sesi admin via API call ke GET /auth/me.
 *
 * Sebelumnya menggunakan js-cookie untuk membaca cookie Authorization,
 * tapi setelah cookie di-set httpOnly: true, JavaScript tidak bisa lagi
 * membaca cookie tersebut. Solusi: minta backend untuk verifikasi —
 * browser otomatis mengirim cookie httpOnly dalam setiap request.
 */
export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { checkAuth } = useAuthStore();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verify = async () => {
      const authenticated = await checkAuth();
      if (!authenticated) {
        navigate("/admin/signin");
      } else {
        setIsAuthenticated(true);
      }
    };
    verify();
  }, [navigate, checkAuth]);

  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center mt-20 text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3" />
        Memeriksa sesi...
      </div>
    );
  }

  return children;
}

