import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { BrowserProvider, formatEther } from "ethers";
import { useToast } from "@/hooks/use-toast";

interface WalletContextType {
  address: string | null;
  balance: string;
  isTestnet: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: () => Promise<void>;
}

export const WalletContext = createContext<WalletContextType>(
  {} as WalletContextType
);

export const NETWORKS = {
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

export function WalletProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [isTestnet, setIsTestnet] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  const getBalance = async (addr: string) => {
    if (!window.ethereum || !addr) return;

    const ethereum = window.ethereum as EthereumProvider;

    try {
      const provider = new BrowserProvider(ethereum);
      const balance = await provider.getBalance(addr);
      setBalance(formatEther(balance));
    } catch (error) {
      console.error("Error getting balance:", error);
    }
  };

  const switchNetwork = async () => {
    const ethereum = window.ethereum as EthereumProvider;
    if (!ethereum) {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask to connect your wallet",
        variant: "destructive",
      });
      return;
    }

    try {
      const network = isTestnet ? NETWORKS.mainnet : NETWORKS.testnet;
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: network.chainId }],
      });
      setIsTestnet(!isTestnet);
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          const network = isTestnet ? NETWORKS.mainnet : NETWORKS.testnet;
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [network],
          });
          setIsTestnet(!isTestnet);
        } catch (addError) {
          console.error("Failed to add network:", addError);
          toast({
            title: "Network Error",
            description: "Failed to add network. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        console.error("Failed to switch network:", switchError);
        toast({
          title: "Network Error",
          description: "Failed to switch network. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const connectWallet = async () => {
    const ethereum = window.ethereum as EthereumProvider;
    if (!ethereum) {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask to connect your wallet",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setAddress(accounts[0]);
        await getBalance(accounts[0]);
        const chainId = await ethereum.request({ method: "eth_chainId" });
        setIsTestnet(chainId === NETWORKS.testnet.chainId);

        toast({
          title: "Wallet Connected",
          description: `Successfully connected to Core DAO ${
            chainId === NETWORKS.testnet.chainId ? "Testnet" : "Mainnet"
          }`,
        });
      }
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

  const disconnectWallet = () => {
    setAddress(null);
    setBalance("0");
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  useEffect(() => {
    const checkWalletConnection = async () => {
      const ethereum = window.ethereum as EthereumProvider;
      if (!ethereum) return;

      try {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          await getBalance(accounts[0]);
          const chainId = await ethereum.request({ method: "eth_chainId" });
          setIsTestnet(chainId === NETWORKS.testnet.chainId);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };

    checkWalletConnection();

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        await getBalance(accounts[0]);
      } else {
        setAddress(null);
        setBalance("0");
      }
    };

    const handleChainChanged = (chainId: string) => {
      setIsTestnet(chainId === NETWORKS.testnet.chainId);
      getBalance(address!);
    };

    const ethereum = window.ethereum as EthereumProvider;
    if (ethereum) {
      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("chainChanged", handleChainChanged);

      return () => {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
        ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [address]);

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        isTestnet,
        isConnecting,
        connectWallet,
        disconnectWallet,
        switchNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
