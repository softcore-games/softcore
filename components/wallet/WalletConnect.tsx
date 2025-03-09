"use client";
import { useWallet } from "@/lib/contexts/WalletContext";
import { CoreButton } from "../nav-bar/core-button";
import { useState, useRef, useEffect } from "react";
import { FaWallet, FaExchangeAlt } from "react-icons/fa";

export function WalletConnect() {
  const {
    walletAddress,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
  } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitchWallet = async () => {
    try {
      await window.ethereum?.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
      // The user will be prompted to switch accounts in MetaMask
      // The accountsChanged event in WalletContext will handle the update
    } catch (error) {
      console.error("Failed to switch wallet:", error);
    }
    setShowDropdown(false);
  };

  if (error) {
    return (
      <div className="text-red-500">
        <p>{error}</p>
        <button
          onClick={() => window.open("https://metamask.io", "_blank")}
          className="text-sm underline"
        >
          Install MetaMask
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <CoreButton
        className="flex items-center gap-2"
        onClick={
          walletAddress ? () => setShowDropdown(!showDropdown) : connectWallet
        }
        disabled={isConnecting}
        variant="wallet"
        walletAddress={walletAddress}
      />

      {/* Dropdown Menu */}
      {showDropdown && walletAddress && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            <button
              onClick={handleSwitchWallet}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
            >
              <FaExchangeAlt />
              Switch Wallet
            </button>
            <button
              onClick={() => {
                disconnectWallet();
                setShowDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
            >
              <FaWallet />
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
