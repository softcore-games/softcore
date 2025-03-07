import { useWallet } from "@/lib/contexts/WalletContext";
import { CoreButton } from "../nav-bar/core-button";

export function WalletConnect() {
  const {
    walletAddress,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
  } = useWallet();

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
    <CoreButton
      className="flex items-center gap-2"
      onClick={walletAddress ? disconnectWallet : connectWallet}
      disabled={isConnecting}
      variant="wallet"
      walletAddress={walletAddress}
    />
  );
}
