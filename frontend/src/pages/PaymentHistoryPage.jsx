import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaymentHistory from "../components/PaymentHistory";

export default function PaymentHistoryPage() {
  const navigate = useNavigate();
  const { status } = useParams();
  const [selectedStatus, setSelectedStatus] = useState(status || "completed");

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Challenge By FDS", value: "challengeByFDS" },
    { label: "Completed", value: "completed" },
    { label: "Denied", value: "denied" },
    { label: "Expired", value: "expired" },
    { label: "Cancelled", value: "cancelled" },
  ];

  // Perbarui status ketika URL berubah
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

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Payment History
      </h1>

      {/* Pilihan status transaksi */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {statusOptions.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => handleStatusChange(value)}
            className={`px-6 py-3 rounded-lg transition font-medium shadow-md ${
              selectedStatus === value
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Komponen PaymentHistory sesuai status yang dipilih */}
      <PaymentHistory status={selectedStatus} />
    </div>
  );
}
