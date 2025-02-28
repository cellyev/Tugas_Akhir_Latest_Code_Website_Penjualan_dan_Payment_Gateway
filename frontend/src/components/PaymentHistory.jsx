import { useEffect, useState, useCallback } from "react";
import { useTransactionStore } from "../store/transactionStore";
import { toast } from "react-toastify";

export default function PaymentHistory({ status }) {
  const {
    fetchAllTransactionByStatus,
    transactions = [],
    transactionItems = [],
    isLoading,
    error,
    clearTransactions,
  } = useTransactionStore();
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const fetchTransactions = useCallback(async () => {
    if (!status) return;
    try {
      await fetchAllTransactionByStatus(status);
    } catch (err) {
      toast.error(err.message);
    }
  }, [status, fetchAllTransactionByStatus]);

  useEffect(() => {
    clearTransactions();
    fetchTransactions();
  }, [status, fetchTransactions, clearTransactions]);

  const formatCurrency = (amount) => {
    if (typeof amount !== "number" || isNaN(amount)) {
      return "Rp 0";
    }
    return amount.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {isLoading && (
        <p className="text-center text-gray-500">Loading transactions...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!isLoading && transactions.length === 0 && !error && (
        <p className="text-center text-gray-500">
          No transactions found for the selected status.
        </p>
      )}
      {!isLoading && transactions.length > 0 && (
        <div className="space-y-6">
          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="p-4 sm:p-6 bg-white shadow-lg rounded-lg border border-gray-200"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Transaction ID: {transaction._id}
                  </h2>
                  <p className="text-gray-600">
                    Customer: {transaction.customer_name}
                  </p>
                  <p className="text-gray-600">
                    Email: {transaction.customer_email}
                  </p>
                  <p className="text-gray-600">
                    Table Code: {transaction.table_code}
                  </p>
                  <p className="text-gray-800 font-semibold">
                    Total: {formatCurrency(transaction.total_amount)}
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      transaction.status === "completed"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    Status: {transaction.status}
                  </p>
                  <p className="text-gray-500">
                    Created At: {formatDate(transaction.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setSelectedTransaction(
                      selectedTransaction === transaction._id
                        ? null
                        : transaction._id
                    )
                  }
                  className="mt-4 sm:mt-0 bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  {selectedTransaction === transaction._id
                    ? "Hide Items"
                    : "View Items"}
                </button>
              </div>
              {selectedTransaction === transaction._id && (
                <div className="mt-4 border-t border-gray-300 pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Transaction Items
                  </h3>
                  {transactionItems.filter(
                    (item) => item.transaction_id === transaction._id
                  ).length === 0 ? (
                    <p className="text-gray-500">
                      No items found for this transaction.
                    </p>
                  ) : (
                    transactionItems
                      .filter((item) => item.transaction_id === transaction._id)
                      .map((item) => (
                        <div
                          key={item._id}
                          className="flex flex-col sm:flex-row justify-between bg-gray-100 p-4 rounded-lg shadow-sm mb-2"
                        >
                          <div>
                            <p className="text-gray-800 font-medium">
                              {item.product_name || "Unknown Product"}
                            </p>
                            <p className="text-gray-600">
                              Qty: {item.qty || 0}
                            </p>
                          </div>
                          <p className="text-gray-800 font-semibold">
                            {formatCurrency(item.amount || 0)}
                          </p>
                        </div>
                      ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
