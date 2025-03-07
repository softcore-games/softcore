"use client";
import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";

const Auth = () => {
  const { login, verifyAuth } = useAuth();
  const [formData, setFormData] = useState({
    login: "", // Changed from email to login
    password: "",
    username: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      // If it's the email input, update both email and login
      [name]: value,
      ...(name === "email" ? { login: value } : {}),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (
      !formData.password ||
      (!isLogin && !formData.username) ||
      (isLogin && !formData.login)
    ) {
      setError("All fields are required");
      return;
    }

    try {
      if (isLogin) {
        const result = await login({
          email: formData.login, // Using login field for email/username
          password: formData.password,
        });

        if (!result.success) {
          setError(result.error || "Invalid credentials");
        } else {
          setSuccess("Login successful! Redirecting...");
          // Force a refresh of the auth state and navigation
          await verifyAuth();
          // Use window.location.href for a full page reload to ensure state is fresh
          window.location.href = "/character";
        }
      } else {
        // Registration
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.login, // Using login field for email
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Registration failed");
        } else {
          setSuccess("Registration successful! Please log in.");
          // Reset form and switch to login view after successful registration
          setFormData({ login: "", password: "", username: "" });
          setIsLogin(true);
          await verifyAuth(); // Add this line to refresh the auth state
          window.location.href = "/character";
        }
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({ login: "", password: "", username: "" });
    setError("");
    setSuccess("");
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
      <div className="bg-black/70 backdrop-blur-none shadow-xl p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-4xl shadow-lg w-full max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[580px] text-center pt-10 sm:pt-12 md:pt-16 lg:pt-20 px-4 sm:px-6 md:px-10 lg:px-20 relative z-10 ">
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="USERNAME"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full p-2 sm:p-3 mb-3 sm:mb-4 rounded-full bg-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none shadow-inner border border-gray-300 text-sm sm:text-base"
            />
          )}
          <input
            type="text"
            name="email"
            placeholder={isLogin ? "EMAIL OR USERNAME" : "EMAIL ADDRESS"}
            value={formData.login}
            onChange={handleInputChange}
            className="w-full p-2 sm:p-3 mb-3 sm:mb-4 rounded-full bg-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none shadow-inner border border-gray-300 text-sm sm:text-base"
          />
          <input
            type="password"
            name="password"
            placeholder="PASSWORD"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-2 sm:p-3 mb-3 sm:mb-1 rounded-full bg-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none shadow-inner border border-gray-300 text-sm sm:text-base"
          />
          {error && (
            <div className="text-red-500 text-sm mb-3 bg-red-100/10 p-2 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-500 text-sm mb-3 bg-green-100/10 p-2 rounded">
              {success}
            </div>
          )}
          {isLogin && (
            <div className="flex justify-between text-xs text-gray-300 mb-3 sm:mb-4 mx-2 sm:mx-4">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  resetForm();
                }}
                className="hover:underline"
              >
                Register Now
              </button>
              <Link href="/forgot-password" className="hover:underline">
                Forgot Password?
              </Link>
            </div>
          )}
          <button
            type="submit"
            className="w-28 sm:w-32 md:w-36 bg-pink-500 hover:bg-pink-600 text-white p-1 mb-3 mt-3 rounded-lg font-normal shadow-xl sm:shadow-2xl text-sm sm:text-base"
          >
            {isLogin ? "LOGIN" : "REGISTER"}
          </button>

          {isLogin && (
            <>
              <hr className="my-4 border-gray-300 border-t-2" />
              <h2 className="text-gray-100 text-xl pt-2">Register</h2>
            </>
          )}

          {!isLogin && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  resetForm();
                }}
                className="text-gray-300 hover:underline text-sm"
              >
                Already have an account? Login
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Auth;
