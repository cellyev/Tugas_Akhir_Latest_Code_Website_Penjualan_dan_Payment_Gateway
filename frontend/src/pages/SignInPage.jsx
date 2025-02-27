import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function SignInPage() {
  const navigate = useNavigate();
  const { signin, isLoading } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signin(username, password);
      navigate("/admin/transaction");
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Welcome Back!
        </h2>
        {errorMessage && (
          <p className="text-red-500 text-sm text-center mb-4">
            {errorMessage}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 text-gray-900 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
