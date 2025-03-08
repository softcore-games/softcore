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
      className="w-full min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat fixed inset-0 px-3 py-4 sm:px-6 md:px-8 lg:px-10"
      style={{
        backgroundImage: "url('/images/wmremove-transformed.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="bg-black/70  shadow-2xl p-4 sm:p-6 md:p-8 rounded-4xl w-full max-w-[90%] sm:max-w-[450px] md:max-w-[500px] lg:max-w-[550px] text-center relative z-10 border border-gray-800">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6">
          Contact
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-5 md:space-y-6"
        >
          <div className="text-left">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full pb-2 bg-transparent text-gray-300 placeholder-gray-100 focus:outline-none border-b border-gray-400 text-xs sm:text-sm md:text-base"
              required
            />
          </div>
          <div className="text-left">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pb-2 bg-transparent text-gray-300 placeholder-gray-100 focus:outline-none border-b border-gray-400 text-xs sm:text-sm md:text-base"
              required
            />
          </div>
          <div className="text-left">
            <input
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleInputChange}
              className="w-full pb-2 bg-transparent text-gray-300 placeholder-gray-100 focus:outline-none border-b border-gray-400 text-xs sm:text-sm md:text-base"
              required
            />
          </div>

          <div className="space-y-4 pt-2 text-start">
            <button
              type="button"
              onClick={handleReset}
              className="px-2 text-gray-300 border border-gray-400 rounded-md hover:bg-gray-700 hover:text-white transition-colors text-sm sm:text-base"
            >
              Reset
            </button>

            <div className="w-full">
              <button
                type="submit"
                className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-medium shadow-xl transition-colors text-sm sm:text-base"
              >
                Submit
              </button>
            </div>
          </div>
        </form>

        <div className="text-center mt-4 sm:mt-5 md:mt-6">
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300 hover:underline transition-colors text-xs sm:text-sm md:text-base"
          >
            Back to Home page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;
