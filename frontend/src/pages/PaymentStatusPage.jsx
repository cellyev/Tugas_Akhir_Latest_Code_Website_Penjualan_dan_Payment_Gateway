import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchTransaction } from "../store/useTransactionStore";

const PaymentStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const transaction_id = queryParams.get("order_id");
  const status = queryParams.get("transaction_status");

  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    if (!transaction_id) {
      setTimeout(() => navigate("/"), 3000);
      return;
    }

    const fetchData = async () => {
      try {
        const data = await fetchTransaction(transaction_id);
        setPaymentDetails(data);
      } catch (error) {
        console.error("Error fetching transaction:", error);
        setTimeout(() => navigate("/"), 3000);
      }
    };

    fetchData();
  }, [transaction_id, navigate]);

  if (!paymentDetails) {
    return (
      <div className="p-4 max-w-md mx-auto text-center">
        <p>Loading payment details... Redirecting if failed.</p>
      </div>
    );
  }

  const { amount, items } = paymentDetails;
  let itemsArray = Array.isArray(items) ? items : items ? [items] : [];

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
          className={`${
            status === "settlement" ? "text-green-600" : "text-red-600"
          } font-semibold text-lg mb-2`}
        >
          Status: {status}
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
