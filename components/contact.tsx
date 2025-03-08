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
      className="w-full min-h-screen grid place-items-center justify-center bg-cover bg-center bg-no-repeat fixed inset-0"
      style={{
        backgroundImage: "url('/images/wmremove-transformed.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="bg-black/70 backdrop-blur-none shadow-xl p-6 rounded-2xl sm:rounded-4xl shadow-lg w-full max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[580px] text-center relative z-10">
        <h2 className="text-xl font-bold text-white mb-4">Contact</h2>
        <hr className="border-t-2 border-gray-300 mb-5" />
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full p-2 rounded-full bg-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none shadow-inner border border-gray-300 text-sm sm:text-base"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 rounded-full bg-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none shadow-inner border border-gray-300 text-sm sm:text-base"
            />
          </div>
          <div>
            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-2 rounded-xl bg-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none shadow-inner border border-gray-300 text-sm sm:text-base"
            />
          </div>
          <div className="flex justify-start">
            <button
              type="button"
              onClick={handleReset}
              className="px-1  text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Reset
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-1.5 rounded-lg font-normal shadow-xl transition-colors"
          >
            Submit
          </button>
        </form>
        <div className="text-center mt-4">
          <Link href="/" className="text-white hover:underline">
            Back to Home page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;
