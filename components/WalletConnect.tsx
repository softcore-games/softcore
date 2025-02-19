"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Wallet, ExternalLink, SwitchCamera, ChevronDown } from "lucide-react";
import { BrowserProvider, Eip1193Provider } from "ethers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

declare global {
  interface Window {
    ethereum?: Eip1193Provider & {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (params: any) => void) => void;
      removeListener: (event: string, callback: (params: any) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

const NETWORKS = {
  mainnet: {
    chainId: "0x45C", // 1116
    chainName: "Core DAO",
    nativeCurrency: {
      name: "CORE",
      symbol: "CORE",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.coredao.org"],
    blockExplorerUrls: ["https://scan.coredao.org"],
  },
  testnet: {
    chainId: "0x45B",
    chainName: "Core DAO Testnet",
    nativeCurrency: {
      name: "tCORE",
      symbol: "tCORE",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.test.btcs.network"],
    blockExplorerUrls: ["https://scan.test.btcs.network"],
  },
};

export function WalletConnect() {
  const { toast } = useToast();
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTestnet, setIsTestnet] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (!window.ethereum) return;

      try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_accounts", []);

        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setAddress(address);

          const network = await provider.getNetwork();
          const targetChainId = parseInt(NETWORKS.testnet.chainId, 16);

          setIsTestnet(network.chainId === BigInt(targetChainId));
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };

    checkWalletConnection();
  }, []);

  const switchNetwork = async () => {
    if (!window.ethereum) return;

    try {
      setIsSwitching(true);
      const network = isTestnet ? NETWORKS.mainnet : NETWORKS.testnet;
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: network.chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          const network = isTestnet ? NETWORKS.mainnet : NETWORKS.testnet;
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [network],
          });
        } catch (addError) {
          console.error("Failed to add network:", addError);

          return;
        }
      } else {
        console.error("Failed to switch network:", switchError);

        return;
      }
    } finally {
      setIsSwitching(false);
    }

    setIsTestnet(!isTestnet);
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask to connect your wallet",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      // Check if we're on the correct network
      const network = await provider.getNetwork();
      const targetChainId = parseInt(
        isTestnet ? NETWORKS.testnet.chainId : NETWORKS.mainnet.chainId,
        16
      );

      setIsTestnet(network.chainId === BigInt(targetChainId));
      setAddress(address);
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to Core DAO ${
          isTestnet ? "Testnet" : "Mainnet"
        }`,
      });
    } catch (error) {
      console.error("Wallet connection error:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const formatAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const getExplorerUrl = () =>
    isTestnet
      ? `https://scan.test.btcs.network/address/${address}`
      : `https://scan.coredao.org/address/${address}`;

  const disconnectWallet = () => {
    setAddress(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={switchNetwork}
        disabled={isSwitching}
        variant="outline"
        className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-medium"
      >
        <SwitchCamera className="w-4 h-4 mr-2" />
        <span className="text-sm font-medium">
          {isSwitching ? "Switching..." : isTestnet ? "Testnet" : "Mainnet"}
        </span>
      </Button>

      {address ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-medium"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
              <span className="text-sm font-medium">
                {formatAddress(address)}
              </span>
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700">
            <DropdownMenuItem
              className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={() => window.open(getExplorerUrl(), "_blank")}
            >
              <ExternalLink className="w-4 h-4" />
              View on Explorer
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-gray-700"
              onClick={disconnectWallet}
            >
              <Wallet className="w-4 h-4" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          onClick={connectWallet}
          disabled={isConnecting}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-medium"
        >
          <Wallet className="w-4 h-3 mr-2" />
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      )}
    </div>
  );
}
