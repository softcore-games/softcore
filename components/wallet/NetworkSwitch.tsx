
import { Button } from "@/components/ui/button";
import { SwitchCamera } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";

export function NetworkSwitch() {
  const { isTestnet, switchNetwork } = useWallet();

  return (
    <Button
      onClick={switchNetwork}
      variant="outline"
      className="bg-gradient-to-r from-love-400 to-love-500 hover:from-love-500 hover:to-love-600 text-white font-medium border-love-300 dark:border-love-600"
    >
      <SwitchCamera className="w-4 h-4 mr-2" />
      <span className="text-sm font-medium">
        {isTestnet ? "Testnet" : "Mainnet"}
      </span>
    </Button>
  );
}
