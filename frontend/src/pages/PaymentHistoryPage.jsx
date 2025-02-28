import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaymentHistory from "../components/PaymentHistory";
import { useAuthStore } from "../store/authStore";

export default function PaymentHistoryPage() {
  const navigate = useNavigate();
  const { status } = useParams();
  const [selectedStatus, setSelectedStatus] = useState(status || "completed");
  const { signout } = useAuthStore();

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Challenge By FDS", value: "challengeByFDS" },
    { label: "Completed", value: "completed" },
    { label: "Denied", value: "denied" },
    { label: "Expired", value: "expired" },
    { label: "Cancelled", value: "cancelled" },
  ];

  useEffect(() => {
    if (status) {
      setSelectedStatus(status);
    }
  }, [status]);

  const handleStatusChange = (newStatus) => {
    if (newStatus !== selectedStatus) {
      setSelectedStatus(newStatus);
      navigate(`/admin/transaction/${newStatus}`);
    }
  };

  const handleLogout = async () => {
    await signout();
    navigate("/admin/signin");
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6">
      {/* Header: Payment History & Logout Button */}
      <div className="flex justify-between items-center w-full mb-6">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800">
          Payment History
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 sm:px-6 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
        {statusOptions.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => handleStatusChange(value)}
            className={`px-4 sm:px-6 py-2 rounded-lg transition font-medium shadow-md text-sm sm:text-base ${
              selectedStatus === value
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <PaymentHistory status={selectedStatus} />
    </div>
  );
}
