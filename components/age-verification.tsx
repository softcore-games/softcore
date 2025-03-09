"use client";
import { useState, useEffect } from "react";
import { setCookie, getCookie } from "cookies-next";

export default function AgeVerification() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const ageVerified = getCookie("age_verified");
    if (!ageVerified) {
      setShowModal(true);
    }
  }, []);

  const handleAccept = () => {
    setCookie("age_verified", "true", {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: "/",
    });
    setShowModal(false);
  };

  const handleDecline = () => {
    window.location.href = "https://www.google.com";
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-md w-full p-6 border-2 border-pink-500 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Age Verification Required</h2>
        
        <div className="bg-pink-500/10 rounded-lg p-4 mb-6">
          <p className="text-white text-center leading-relaxed">
            This website contains adult content and is only suitable for those who are 18 years or older.
            By entering, you confirm that you are at least 18 years of age.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleAccept}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-semibold transition-colors duration-200 transform hover:scale-[1.02]"
          >
            I am 18 or older - Enter
          </button>
          
          <button
            onClick={handleDecline}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            I am under 18 - Exit
          </button>
        </div>

        <p className="text-gray-400 text-sm text-center mt-4">
          By entering this site, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}