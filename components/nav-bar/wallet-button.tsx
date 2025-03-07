import { FaWallet } from "react-icons/fa";

interface WalletButtonProps {
  onClick: () => void;
  disabled: boolean;
  walletAddress?: string;
  className?: string;
}

export const WalletButton = ({ onClick, disabled, walletAddress, className = "" }: WalletButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`bg-yellow-400 text-lg text-black rounded-full border-2 border-black font-semibold hover:bg-yellow-500 transition-colors flex items-center gap-2 ${className}`}
  >
    <FaWallet className="text-xl" />
    {walletAddress
      ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
      : "CONNECT"}
  </button>
);