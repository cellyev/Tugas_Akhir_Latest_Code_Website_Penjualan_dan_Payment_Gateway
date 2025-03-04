import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-8 mt-12 shadow-inner">
      <div className="container mx-auto px-6 text-center md:text-left">
        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul>
              <li>
                <Link
                  to="/home"
                  className="hover:text-blue-400 block mb-2 text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="hover:text-blue-400 block mb-2 text-sm"
                >
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Follow Us</h4>
            <div className="flex justify-center md:justify-start space-x-4">
              <a
                href="#"
                className="hover:text-blue-400 text-2xl"
                aria-label="Facebook"
                target="blank"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="hover:text-blue-400 text-2xl"
                aria-label="Twitter"
                target="blank"
              >
                <FaTwitter />
              </a>
              <a
                href="https://www.instagram.com/_excelv/"
                className="hover:text-blue-400 text-2xl"
                aria-label="Instagram"
                target="blank"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <p className="text-sm mb-2">
              Email:{" "}
              <a
                href="mailto:vailovent@gmail.com"
                className="hover:text-blue-400"
              >
                vailovent@gmail.com
              </a>
            </p>
            <p className="text-sm">
              Phone:{" "}
              <a href="tel:+6289527749870" className="hover:text-blue-400">
                +62 895 2774 9870
              </a>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t pt-6 text-sm text-gray-400 text-center">
          <p>&copy; 2025 Vailovent. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
