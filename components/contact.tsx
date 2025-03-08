"use client";
import { useState } from "react";
import Link from "next/link";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log("Form submitted:", formData);
    // You can add API call to send the contact form data
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      email: "",
      message: "",
    });
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat fixed inset-0 px-4 py-6 sm:px-6 md:px-8"
      style={{
        backgroundImage: "url('/images/wmremove-transformed.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="bg-black/70 backdrop-blur-sm shadow-2xl p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl md:rounded-4xl w-full max-w-[95%] xs:max-w-[90%] sm:max-w-[80%] md:max-w-[600px] lg:max-w-[650px] text-center relative z-10 border border-gray-800">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 md:mb-5">
          Contact
        </h2>
        <hr className="border-t border-gray-600 mb-4 sm:mb-5 md:mb-6 mx-auto w-3/4" />

        <form
          onSubmit={handleSubmit}
          className="space-y-3 sm:space-y-4 md:space-y-5"
        >
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full p-2 sm:p-3 rounded-full bg-gray-200/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 shadow-inner border border-gray-300 text-sm sm:text-base transition-all"
              required
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 sm:p-3 rounded-full bg-gray-200/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 shadow-inner border border-gray-300 text-sm sm:text-base transition-all"
              required
            />
          </div>
          <div>
            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-3 sm:p-4 rounded-xl bg-gray-200/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 shadow-inner border border-gray-300 text-sm sm:text-base transition-all"
              required
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 hover:text-white transition-colors text-sm sm:text-base flex items-center gap-1"
            >
              <span>Reset</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium shadow-xl transition-colors text-sm sm:text-base"
            >
              Submit
            </button>
          </div>
        </form>

        <div className="text-center mt-6 sm:mt-8">
          <Link
            href="/"
            className="text-gray-300 hover:text-white hover:underline transition-colors text-sm sm:text-base inline-flex items-center gap-1"
          >
            Back to Home page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;
