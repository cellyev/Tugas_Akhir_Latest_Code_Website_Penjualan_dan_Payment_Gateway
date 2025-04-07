import { useEffect, useState } from "react";
import { useTermsAndConditionsStore } from "../store/termsAndConditionsStore";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaChevronUp,
  FaChevronDown,
  FaLock,
  FaExternalLinkAlt,
} from "react-icons/fa";

export default function TermsAndConditionsGate({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [readTimeEstimate, setReadTimeEstimate] = useState("2-3 minutes");
  const { fetchTermsAndConditions, termsAndConditions, isLoading, error } =
    useTermsAndConditionsStore();

  // Check acceptance status on component mount
  useEffect(() => {
    const hasAcceptedTerms = sessionStorage.getItem("hasAcceptedTerms");
    if (hasAcceptedTerms !== "true") {
      fetchTermsAndConditions();
      setIsModalOpen(true);

      // Calculate read time based on content length
      if (termsAndConditions.length > 0) {
        const totalWords = termsAndConditions.reduce(
          (acc, term) => acc + term.text.split(/\s+/).length,
          0
        );
        const minutes = Math.max(1, Math.ceil(totalWords / 200)); // 200 wpm reading speed
        setReadTimeEstimate(`${minutes}-${minutes + 1} minutes`);
      }
    }
  }, [fetchTermsAndConditions, termsAndConditions.length]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrolledToBottom = scrollTop + clientHeight >= scrollHeight - 20;
    setHasScrolled(scrolledToBottom);
  };

  const handleAccept = () => {
    sessionStorage.setItem("hasAcceptedTerms", "true");
    setIsModalOpen(false);
    // Optional: Track acceptance in analytics
  };

  const handleDecline = () => {
    // Provide feedback before declining
    if (
      window.confirm(
        "Are you sure you want to leave? You won't be able to access our services without accepting the terms."
      )
    ) {
      window.location.href = "/"; // Redirect to home instead of refresh
    }
  };

  const toggleSection = (no) => {
    setExpandedSections((prev) => ({
      ...prev,
      [no]: !prev[no],
    }));
  };

  const expandAllSections = () => {
    const allExpanded = {};
    termsAndConditions.forEach((term) => {
      allExpanded[term.no] = true;
    });
    setExpandedSections(allExpanded);
  };

  const collapseAllSections = () => {
    setExpandedSections({});
  };

  // If terms aren't accepted, show the modal and block page content
  if (isModalOpen) {
    return (
      <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center p-4 md:p-6">
        {/* Main modal container */}
        <div className="w-full max-w-4xl h-full max-h-[90vh] flex flex-col bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
          {/* Header with gradient and lock icon */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-5 md:p-6 text-white">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-3 mb-2">
                <FaLock className="text-xl md:text-2xl" />
                <h1 className="text-xl md:text-2xl font-bold">
                  Terms & Conditions Agreement
                </h1>
              </div>
              <p className="text-blue-100 text-sm md:text-base max-w-2xl">
                To continue using our services, please review and accept our
                updated Terms & Conditions
              </p>
              <div className="mt-3 bg-blue-400/20 px-3 py-1 rounded-full text-xs md:text-sm">
                Estimated read time: {readTimeEstimate}
              </div>
            </div>
          </div>

          {/* Content area with scrollable terms */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Controls bar */}
            <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600">
                {termsAndConditions.length} sections
              </div>
              <div className="flex gap-2">
                <button
                  onClick={expandAllSections}
                  className="text-xs md:text-sm px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAllSections}
                  className="text-xs md:text-sm px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  Collapse All
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div
              className="flex-1 overflow-y-auto p-4 md:p-6"
              onScroll={handleScroll}
            >
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-gray-600">
                    Loading terms and conditions...
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    This should only take a moment
                  </p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-red-700 font-medium">
                    We couldn&apos;t load the terms and conditions
                  </p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                  <button
                    onClick={() => fetchTermsAndConditions()}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <h3 className="font-bold text-blue-800 mb-1">
                      Before you continue...
                    </h3>
                    <p className="text-blue-700 text-sm">
                      These terms outline your rights and responsibilities when
                      using our services. Please read them carefully before
                      accepting.
                    </p>
                  </div>

                  {termsAndConditions.map((term) => (
                    <div
                      key={term.no}
                      className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200"
                    >
                      <button
                        onClick={() => toggleSection(term.no)}
                        className={`flex items-center justify-between w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                          expandedSections[term.no] ? "bg-gray-50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                            {term.no}
                          </div>
                          <h3 className="font-semibold text-gray-800 text-left">
                            {term.title}
                          </h3>
                        </div>
                        {expandedSections[term.no] ? (
                          <FaChevronUp className="text-gray-500 ml-2" />
                        ) : (
                          <FaChevronDown className="text-gray-500 ml-2" />
                        )}
                      </button>
                      {expandedSections[term.no] && (
                        <div className="px-4 pb-4 pt-2 bg-white">
                          <div className="prose prose-sm max-w-none text-gray-700">
                            <p className="whitespace-pre-line">{term.text}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Progress indicator */}
            <div className="h-1 bg-gray-200">
              <div
                className={`h-full bg-blue-500 transition-all duration-300 ${
                  hasScrolled ? "w-full" : "w-1/3"
                }`}
              ></div>
            </div>

            {/* Footer with action buttons */}
            <div className="border-t border-gray-200 p-4 md:p-6 bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <button
                  onClick={handleDecline}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 transition-colors font-medium flex-1"
                >
                  <FaTimesCircle />
                  <span>Decline and Exit</span>
                </button>
                <button
                  onClick={handleAccept}
                  disabled={!hasScrolled}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors flex-1 ${
                    hasScrolled
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md hover:shadow-lg"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <FaCheckCircle />{" "}
                  {hasScrolled
                    ? "Accept Terms & Continue"
                    : "Please read all terms to continue"}
                </button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-gray-500 text-xs md:text-sm">
                  By accepting, you agree to our{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Terms & Conditions{" "}
                    <FaExternalLinkAlt className="inline text-xs" />
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Privacy Policy{" "}
                    <FaExternalLinkAlt className="inline text-xs" />
                  </a>
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Only render children if terms are accepted
  return children;
}
