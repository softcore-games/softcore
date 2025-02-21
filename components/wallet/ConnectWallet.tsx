
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";

export function ConnectWallet() {
  const { isConnecting, connectWallet } = useWallet();

  return (
    <Button
      onClick={connectWallet}
      disabled={isConnecting}
      className="bg-gradient-to-r from-love-400 to-love-500 hover:from-love-500 hover:to-love-600 text-white font-medium"
    >
      <Wallet className="w-4 h-3 mr-2" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
