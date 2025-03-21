import { useState, useEffect, useRef } from "react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useTransactionStore } from "../store/transactionStore";
import { useCartStore } from "../store/cartStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [tableCode, setTableCode] = useState("");
  const [isPolling, setIsPolling] = useState(false);
  const navigate = useNavigate();
  const { cart, setCart, removeItemFromCart } = useCartStore();

  const {
    setTransactionDetails,
    createTransaction,
    fetchTransaction,
    error,
    isLoading,
  } = useTransactionStore();

  useEffect(() => {
    const storedCustomer = JSON.parse(sessionStorage.getItem("customer"));
    if (storedCustomer) {
      setCustomerName(storedCustomer.name);
      setCustomerEmail(storedCustomer.email);
      setTableCode(storedCustomer.tableCode);
    } else {
      setCustomerName("");
      setCustomerEmail("");
      setTableCode("");
    }
  }, []);

  const handleIncrement = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity += 1;
    setCart(updatedCart);
  };

  const handleDecrement = (index) => {
    const updatedCart = [...cart];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
    } else {
      updatedCart.splice(index, 1);
    }
    setCart(updatedCart);
  };

  const handleRemoveItem = (index) => {
    removeItemFromCart(cart[index]._id);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
  };

  const handleCheckout = async () => {
    if (!customerName || !customerEmail || !tableCode) {
      toast.error("Please fill out all details before checking out!");
      return;
    }

    const transactionData = {
      table_code: tableCode,
      customer_name: customerName,
      customer_email: customerEmail,
      products: cart.map((item) => ({
        product_id: item._id,
        qty: item.quantity,
      })),
    };

    setTransactionDetails(transactionData);

    try {
      const response = await createTransaction();
      if (!response || !response.redirect_url) {
        toast.error("Transaction failed, please try again.");
        return;
      }

      toast.success("Transaction created successfully!");
      setCart([]);
      sessionStorage.removeItem("cart");
      window.open(response.redirect_url, "_blank");

      if (!isPolling) {
        setIsPolling(true);
        startPolling(response.savedTransaction._id);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create transaction!");
    }
  };

  const pollingInterval = useRef(null);
  const startPolling = (transaction_id) => {
    if (pollingInterval.current) return; // Mencegah polling ganda

    pollingInterval.current = setInterval(async () => {
      try {
        const transactionData = await fetchTransaction(transaction_id);
        if (!transactionData?.data?.transaction) return;

        const status = transactionData.data.transaction.status;
        if (status !== "pending") {
          // Jika tidak lagi pending, hentikan polling
          clearInterval(pollingInterval.current);
          pollingInterval.current = null;
          setTimeout(() => window.location.reload(), 1000);

          const route =
            status === "completed" ? "/payment-success" : "/payment-failed";
          const statusMessage =
            status === "completed" ? "Payment successful!" : "Payment Failed!";
          toast.success(statusMessage);
          navigate(route, {
            state: {
              status: status || "Unknown",
              transaction_id,
              amount: transactionData.data.transaction.total_amount,
              items: transactionData.data.transactionItems,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching transaction:", error);
      }
    }, 3000);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Your Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500">Your cart is empty.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Go to Menu
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {cart.map((item, index) => (
            <div
              key={item.id || `cart-item-${index}`}
              className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-300 bg-gray-100 rounded-lg shadow-md"
            >
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg shadow-lg"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {item.name}
                  </h2>
                  <p className="text-gray-600">
                    {formatCurrency(item.price)} x {item.quantity}
                  </p>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleDecrement(index)}
                  className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition duration-300"
                >
                  <FaMinus />
                </button>

                <span className="text-xl text-gray-800">{item.quantity}</span>

                <button
                  onClick={() => handleIncrement(index)}
                  className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition duration-300"
                >
                  <FaPlus />
                </button>

                <button
                  onClick={() => handleRemoveItem(index)}
                  className="bg-gray-600 text-white p-2 rounded-full hover:bg-gray-700 transition duration-300"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}

          <div className="mt-8 space-y-4">
            <div>
              <label className="block font-medium text-gray-800">
                Customer Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={`w-full bg-gray-200 text-gray-800 border p-3 rounded mt-1 ${
                  !customerName ? "border-red-500" : ""
                }`}
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-800">
                Customer Email
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className={`w-full bg-gray-200 text-gray-800 border p-3 rounded mt-1 ${
                  !customerEmail ? "border-red-500" : ""
                }`}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-800">
                Table Code
              </label>
              <input
                type="text"
                value={tableCode}
                onChange={(e) => setTableCode(e.target.value)}
                className={`w-full bg-gray-200 text-gray-800 border p-3 rounded mt-1 ${
                  !tableCode ? "border-red-500" : ""
                }`}
                placeholder="Enter table code (e.g., 1)"
              />
            </div>
          </div>

          <div className="text-right mt-6">
            <p className="text-2xl font-semibold text-gray-800">
              Total: {formatCurrency(calculateTotal())}
            </p>
          </div>

          <div className="text-right mt-4">
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition duration-300"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
              ) : (
                "Checkout"
              )}
            </button>
            {error && <p className="text-red-500 mt-2">Failed: {error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
