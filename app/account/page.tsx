"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useWallet } from "@/lib/contexts/WalletContext";
import Loading from "@/components/loading";
import ProtectedRoute from "@/components/auth/protected-route";
export default function AccountPage() {
  const { user, verifyAuth } = useAuth();
  const { walletAddress, connectWallet } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", content: "" });

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          content: "Profile updated successfully",
        });
        await verifyAuth(); // Refresh user data
      } else {
        setMessage({ type: "error", content: data.error });
      }
    } catch (error) {
      setMessage({ type: "error", content: "Failed to update profile" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      // Update wallet address in database
      const response = await fetch("/api/user/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress }),
      });

      if (!response.ok) {
        throw new Error("Failed to update wallet address");
      }

      await verifyAuth(); // Refresh user data
      setMessage({ type: "success", content: "Wallet connected successfully" });
    } catch (error) {
      setMessage({ type: "error", content: "Failed to connect wallet" });
    }
  };

  if (!user) return <Loading />;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-8">
            Account Settings
          </h1>

          {message.content && (
            <div
              className={`p-4 rounded-lg mb-6 ${
                message.type === "success"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {message.content}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-pink-500 text-white rounded-lg py-3 hover:bg-pink-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">
              Wallet Connection
            </h2>
            {user.walletAddress ? (
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-300">Connected Wallet:</p>
                <p className="text-white font-mono break-all">
                  {user.walletAddress}
                </p>
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                className="w-full bg-blue-500 text-white rounded-lg py-3 hover:bg-blue-600 transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
