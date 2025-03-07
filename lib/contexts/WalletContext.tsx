"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ethers } from "ethers";

interface WalletContextType {
  walletAddress: string | undefined;
  provider: ethers.BrowserProvider | undefined;
  signer: ethers.JsonRpcSigner | undefined;
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string>();
  const [provider, setProvider] = useState<ethers.BrowserProvider>();
  const [signer, setSigner] = useState<ethers.JsonRpcSigner>();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Attempt to restore wallet connection on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress && window.ethereum) {
      connectWallet();
    }
  }, []);

  async function connectWallet() {
    if (!window.ethereum) {
      setError("Please install MetaMask!");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const signer = await provider.getSigner();

      setProvider(provider);
      setSigner(signer);
      setWalletAddress(account);

      // Save wallet address to localStorage
      localStorage.setItem("walletAddress", account);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setError("Failed to connect wallet");
      localStorage.removeItem("walletAddress");
    } finally {
      setIsConnecting(false);
    }
  }

  const disconnectWallet = () => {
    setWalletAddress(undefined);
    setProvider(undefined);
    setSigner(undefined);
    setError(null);
    localStorage.removeItem("walletAddress");
  };

  useEffect(() => {
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          localStorage.setItem("walletAddress", accounts[0]);
        } else {
          disconnectWallet();
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        provider,
        signer,
        isConnecting,
        error,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
