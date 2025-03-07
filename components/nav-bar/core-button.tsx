import { ReactNode } from "react";
import { FaWallet } from "react-icons/fa";

interface CoreButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: "login" | "wallet";
  className?: string;
  walletAddress?: string;
  children?: ReactNode;
}

export const CoreButton = ({
  onClick,
  disabled = false,
  variant = "login",
  className = "",
  walletAddress,
  children,
}: CoreButtonProps) => {
  const baseStyles =
    "px-4 text-lg text-black rounded-full border-2 border-black font-semibold transition-colors";
  const variantStyles = {
    login: "bg-yellow-400 hover:bg-yellow-500",
    wallet: "bg-yellow-400 hover:bg-yellow-500 flex items-center gap-2",
  };

  if (variant === "wallet") {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      >
        <FaWallet className="text-xl" />
        {walletAddress
          ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
          : "CONNECT"}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children || "LOGIN"}
    </button>
  );
};
