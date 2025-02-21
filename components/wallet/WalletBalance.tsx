
import { useWallet } from "@/contexts/WalletContext";

export function WalletBalance() {
  const { balance, isTestnet } = useWallet();

  return (
    <span className="text-sm text-love-600 dark:text-love-300">
      {parseFloat(balance).toFixed(4)} {isTestnet ? "tCORE" : "CORE"}
    </span>
  );
}
