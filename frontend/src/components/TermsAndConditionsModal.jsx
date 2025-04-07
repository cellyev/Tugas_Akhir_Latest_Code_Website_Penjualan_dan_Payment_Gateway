import { useEffect, useState } from "react";
import { useTermsAndConditionsStore } from "../store/termsAndConditionsStore";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaChevronUp,
  FaChevronDown,
  FaLock,
} from "react-icons/fa";

export default function TermsAndConditionsGate({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const { fetchTermsAndConditions, termsAndConditions, isLoading, error } =
    useTermsAndConditionsStore();

  // Check acceptance status on component mount
  useEffect(() => {
    const hasAcceptedTerms = sessionStorage.getItem("hasAcceptedTerms");
    if (hasAcceptedTerms !== "true") {
      fetchTermsAndConditions();
      setIsModalOpen(true);
    }
  }, [fetchTermsAndConditions]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrolledToBottom = scrollTop + clientHeight >= scrollHeight - 20;
    setHasScrolled(scrolledToBottom);
  };

  const handleAccept = () => {
    sessionStorage.setItem("hasAcceptedTerms", "true");
    setIsModalOpen(false);
  };

  const handleDecline = () => {
    // Changed from redirect to page refresh
    window.location.reload();
  };

  const toggleSection = (no) => {
    setExpandedSections((prev) => ({
      ...prev,
      [no]: !prev[no],
    }));
  };

  // If terms aren't accepted, show the modal and block page content
  if (isModalOpen) {
    return (
      <div className="fixed inset-0 bg-white z-[9999] flex flex-col">
        {/* Full-screen blocking modal */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-4xl mx-auto">
          <div className="w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
              <div className="flex items-center justify-center gap-3">
                <FaLock className="text-2xl" />
                <h2 className="text-2xl font-bold">Website Access Required</h2>
              </div>
              <p className="text-center text-blue-100 mt-2">
                You must accept our Terms & Conditions to use this website
              </p>
            </div>

            {/* Content */}
            <div
              className="flex-1 overflow-y-auto p-6 max-h-[60vh]"
              onScroll={handleScroll}
            >
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-gray-600">
                    Loading terms and conditions...
                  </p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <p className="text-red-700 font-medium">{error}</p>
                  <button
                    onClick={() => fetchTermsAndConditions()}
                    className="mt-2 text-blue-600 hover:underline"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <p className="font-medium text-yellow-800">
                      <strong>Important:</strong> By accessing this website, you
                      agree to be bound by these terms.
                    </p>
                  </div>

                  {termsAndConditions.map((term) => (
                    <div
                      key={term.no}
                      className="border-b border-gray-100 pb-4 last:border-0"
                    >
                      <button
                        onClick={() => toggleSection(term.no)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <h3 className="font-semibold text-lg text-gray-800">
                          {term.no}. {term.title}
                        </h3>
                        {expandedSections[term.no] ? (
                          <FaChevronUp className="text-gray-500" />
                        ) : (
                          <FaChevronDown className="text-gray-500" />
                        )}
                      </button>
                      {expandedSections[term.no] && (
                        <div className="mt-2 pl-2 text-gray-600">
                          <p className="whitespace-pre-line">{term.text}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <button
                  onClick={handleDecline}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 transition-colors font-medium"
                >
                  <FaTimesCircle /> Decline
                </button>
                <button
                  onClick={handleAccept}
                  disabled={!hasScrolled}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    hasScrolled
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <FaCheckCircle />{" "}
                  {hasScrolled
                    ? "Accept and Continue"
                    : "Please read all terms"}
                </button>
              </div>

              <p className="text-center text-gray-500 text-xs mt-4">
                By accepting, you agree to our Terms & Conditions and Privacy
                Policy
              </p>
            </div>
          </div>
        </div>

        {/* Blocking overlay */}
        <div className="fixed inset-0 bg-white/90 z-[-1]"></div>
      </div>
    );
  }

  // Only render children if terms are accepted
  return children;
}
