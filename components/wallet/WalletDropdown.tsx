
import { Button } from "@/components/ui/button";
import { Wallet, ExternalLink, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWallet } from "@/contexts/WalletContext";

interface WalletDropdownProps {
  formatAddress: (address: string) => string;
}

export function WalletDropdown({ formatAddress }: WalletDropdownProps) {
  const { address, isTestnet, disconnectWallet } = useWallet();

  const getExplorerUrl = () =>
    isTestnet
      ? `https://scan.test.btcs.network/address/${address}`
      : `https://scan.coredao.org/address/${address}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-gradient-to-r from-love-400 to-love-500 hover:from-love-500 hover:to-love-600 text-white font-medium border-love-300 dark:border-love-600"
        >
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
          <span className="text-sm font-medium">
            {formatAddress(address!)}
          </span>
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white dark:bg-gray-800 border-love-200 dark:border-love-800">
        <DropdownMenuItem
          className="flex items-center gap-2 text-love-700 hover:text-love-800 hover:bg-love-50 dark:text-love-300 dark:hover:text-love-200 dark:hover:bg-love-900/50"
          onClick={() => window.open(getExplorerUrl(), "_blank")}
        >
          <ExternalLink className="w-4 h-4" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/50"
          onClick={disconnectWallet}
        >
          <Wallet className="w-4 h-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
