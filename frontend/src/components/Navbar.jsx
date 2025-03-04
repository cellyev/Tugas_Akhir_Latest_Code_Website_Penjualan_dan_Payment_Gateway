import { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaHome } from "react-icons/fa";
import { useCartStore } from "../store/cartStore"; // Import store

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useCartStore(); // Ambil cart dari store

  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Fungsi untuk menutup menu dan scroll ke atas
  const handleNavClick = () => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };

  // Get the cart count
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-700 shadow-lg sticky top-0 z-10 transition-shadow duration-300">
      <div className="container mx-auto px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <img
            src="https://ta-project-soundbox-payment.s3.ap-southeast-2.amazonaws.com/vailovent-logo.png"
            alt="Logo"
            className="w-12 h-12 rounded-full border-2 border-gray-500"
          />
          <Link
            to="/home"
            className="text-3xl font-extrabold text-white hover:text-gray-300"
          >
            Vailovent
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <Link
            to="/home"
            className="flex items-center space-x-2 text-white hover:text-gray-300 transition duration-200"
          >
            <FaHome />
            <span className="font-medium">Home</span>
          </Link>

          <Link
            to="/cart"
            className="flex items-center space-x-2 text-white hover:text-gray-300 transition duration-200"
          >
            <FaShoppingCart />
            <span className="font-medium">Cart</span>
            {cartCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white text-3xl focus:outline-none"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu - Slide In from Right */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-gradient-to-r from-gray-900 to-gray-700 shadow-xl transform transition-transform duration-300 z-20 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="py-4">
          <button
            onClick={toggleMenu}
            className="block ml-auto mr-6 text-white text-3xl"
          >
            ✕
          </button>
          <Link
            to="/home"
            className="block px-6 py-2 text-white hover:text-gray-300 font-medium"
            onClick={handleNavClick}
          >
            <FaHome />
            <span>Home</span>
          </Link>

          <Link
            to="/cart"
            className="block px-6 py-2 text-white hover:text-gray-300 font-medium"
            onClick={handleNavClick}
          >
            <FaShoppingCart />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-10"
          onClick={toggleMenu}
        ></div>
      )}
    </div>
  );
}
