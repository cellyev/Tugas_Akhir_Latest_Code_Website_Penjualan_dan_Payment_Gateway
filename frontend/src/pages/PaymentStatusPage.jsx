import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useTransactionStore } from "../store/transactionStore";

const PaymentStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const transaction_id = queryParams.get("order_id");
  const status = queryParams.get("transaction_status") || "unknown";

  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const { fetchTransaction } = useTransactionStore();

  // Gunakan useCallback untuk memastikan fungsi tidak berubah di setiap render
  const fetchData = useCallback(async () => {
    if (!transaction_id) {
      setTimeout(() => navigate("/"), 3000);
      return;
    }

    try {
      const data = await fetchTransaction(transaction_id);
      if (data) {
        setPaymentDetails(data);
      }
    } catch (error) {
      console.error("Error fetching transaction:", error);
    } finally {
      setLoading(false);
    }
  }, [transaction_id, navigate, fetchTransaction]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Tambahkan fetchData sebagai dependensi

  if (loading) {
    return (
      <div className="p-4 max-w-md mx-auto text-center">
        <p>Loading payment details... Please wait.</p>
      </div>
    );
  }

  if (!paymentDetails) {
    return (
      <div className="p-4 max-w-md mx-auto text-center">
        <p className="text-red-500">Failed to fetch transaction details.</p>
        <p>Redirecting to home...</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Go to Home
        </button>
      </div>
    );
  }

  const { amount, items } = paymentDetails;
  const itemsArray = Array.isArray(items) ? items : items ? [items] : [];

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h1
        className={`text-3xl font-bold text-center mb-6 ${
          status === "settlement" ? "text-green-600" : "text-red-600"
        }`}
      >
        {status === "settlement" ? "Payment Successful" : "Payment Failed"}
      </h1>
      <div className="mb-4">
        <p
          className={`font-semibold text-lg mb-2 ${
            status === "settlement" ? "text-green-600" : "text-red-600"
          }`}
        >
          Status: {status.charAt(0).toUpperCase() + status.slice(1)}
        </p>
        <p className="text-sm text-gray-600">
          Transaction ID: <span className="font-medium">{transaction_id}</span>
        </p>
        <p className="text-sm text-gray-600">
          Amount:{" "}
          <span className="font-medium">
            Rp {amount ? parseFloat(amount).toLocaleString() : "0"}
          </span>
        </p>
      </div>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Items</h2>
      <table className="min-w-full table-auto border-collapse mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Item
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Quantity
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {itemsArray.length > 0 ? (
            itemsArray.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{item.product_name}</td>
                <td className="px-4 py-2">{item.qty}</td>
                <td className="px-4 py-2">
                  Rp {parseFloat(item.amount).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="3"
                className="px-4 py-2 text-center text-sm text-gray-500"
              >
                No items found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <p className="text-lg font-bold">Total Amount:</p>
        <p
          className={`text-lg font-medium ${
            status === "settlement" ? "text-blue-600" : "text-red-600"
          }`}
        >
          Rp {amount ? parseFloat(amount).toLocaleString() : "N/A"}
        </p>
      </div>

      <button
        onClick={() => navigate("/")}
        className={`w-full mt-6 ${
          status === "settlement"
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-500 hover:bg-gray-600"
        } text-white py-2 rounded-lg transition`}
      >
        Go to Home
      </button>
    </div>
  );
};

export default PaymentStatus;
