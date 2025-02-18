import { useState, useEffect } from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Router from "./routes/Router";
import { ToastContainer } from "react-toastify";
import TermsAndConditionsModal from "./components/TermsAndConditionsModal";

export default function App() {
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const hasAcceptedTerms = sessionStorage.getItem("hasAcceptedTerms");
    console.log("hasAcceptedTerms on load:", hasAcceptedTerms);
    if (hasAcceptedTerms === "true") {
      setTermsAccepted(true);
    }
  }, []);

  const handleAcceptTerms = () => {
    sessionStorage.setItem("hasAcceptedTerms", "true");
    setTermsAccepted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <ToastContainer />
      <Navbar />
      <div className="flex-grow">
        {!termsAccepted && (
          <TermsAndConditionsModal onAccept={handleAcceptTerms} />
        )}
        <Router />
      </div>
      <Footer />
    </div>
  );
}
