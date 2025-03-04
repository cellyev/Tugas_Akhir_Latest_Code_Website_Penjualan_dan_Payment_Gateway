import { useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useProductStore } from "../store/productStore";
import { FaShoppingCart } from "react-icons/fa";
import { useCartStore } from "../store/cartStore";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { products, isLoading, error, fetchProducts } = useProductStore();
  const { cart } = useCartStore(); // Ambil cart dari store
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts(); // Panggil fungsi untuk mengambil produk
  }, [fetchProducts]);

  // Format harga ke dalam IDR
  const formatCurrency = (amount) => {
    return amount.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
  };

  // Hitung total quantity dalam cart
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Hitung total harga dalam cart
  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-500 border-solid"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-xl text-red-500">Error: {error}</div>
    );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
        Welcome to Vailovent!
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <div className="text-center text-xl text-gray-500">
            No products available!
          </div>
        ) : (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>

      {/* Floating Cart Button (seperti semula) */}
      <button
        className="fixed bottom-6 right-6 bg-yellow-500 text-gray-900 p-4 rounded-full shadow-lg flex items-center space-x-3 hover:bg-yellow-600 transition duration-300"
        onClick={() => navigate("/cart")}
      >
        <FaShoppingCart className="text-2xl" />
        <div className="text-lg font-bold">
          {totalQuantity} Items
          <p className="text-sm font-medium">{formatCurrency(totalAmount)}</p>
        </div>
      </button>
    </div>
  );
}
