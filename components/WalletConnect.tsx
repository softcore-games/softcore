'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Wallet, ExternalLink, SwitchCamera } from 'lucide-react';
import { BrowserProvider, JsonRpcSigner } from 'ethers';

const NETWORKS = {
  mainnet: {
    chainId: '0x45C', // 1116
    chainName: 'Core DAO',
    nativeCurrency: {
      name: 'CORE',
      symbol: 'CORE',
      decimals: 18
    },
    rpcUrls: ['https://rpc.coredao.org'],
    blockExplorerUrls: ['https://scan.coredao.org']
  },
  testnet: {
    chainId: '0x45B', // 1115
    chainName: 'Core DAO Testnet',
    nativeCurrency: {
      name: 'tCORE',
      symbol: 'tCORE',
      decimals: 18
    },
    rpcUrls: ['https://rpc.test.btcs.network'],
    blockExplorerUrls: ['https://scan.test.btcs.network']
  }
};

export function WalletConnect() {
  const { toast } = useToast();
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTestnet, setIsTestnet] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const switchNetwork = async () => {
    if (!window.ethereum) return;
    
    setIsSwitching(true);
    try {
      const network = isTestnet ? NETWORKS.mainnet : NETWORKS.testnet;
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: network.chainId }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          const network = isTestnet ? NETWORKS.mainnet : NETWORKS.testnet;
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [network],
          });
        } catch (addError) {
          console.error('Failed to add network:', addError);
          toast({
            title: 'Network Error',
            description: 'Failed to switch networks. Please try again.',
            variant: 'destructive',
          });
          return;
        }
      } else {
        console.error('Failed to switch network:', switchError);
        toast({
          title: 'Network Error',
          description: 'Failed to switch networks. Please try again.',
          variant: 'destructive',
        });
        return;
      }
    } finally {
      setIsSwitching(false);
    }

    setIsTestnet(!isTestnet);
    toast({
      title: 'Network Switched',
      description: `Switched to ${!isTestnet ? 'Testnet' : 'Mainnet'}`,
    });

    // Reconnect wallet after network switch
    if (address) {
      await connectWallet();
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: 'Wallet Not Found',
        description: 'Please install MetaMask to connect your wallet',
        variant: 'destructive',
      });
      return;
    }

    setIsConnecting(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      // Check if we're on the correct network
      const network = await provider.getNetwork();
      const targetChainId = parseInt(isTestnet ? NETWORKS.testnet.chainId : NETWORKS.mainnet.chainId, 16);
      
      if (network.chainId !== BigInt(targetChainId)) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [isTestnet ? NETWORKS.testnet : NETWORKS.mainnet],
          });
        } catch (error) {
          console.error('Failed to add network:', error);
        }
      }

      setAddress(address);
      toast({
        title: 'Wallet Connected',
        description: `Successfully connected to Core DAO ${isTestnet ? 'Testnet' : 'Mainnet'}`,
      });
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect wallet. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getExplorerUrl = () => {
    return isTestnet 
      ? `https://scan.test.btcs.network/address/${address}`
      : `https://scan.coredao.org/address/${address}`;
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={switchNetwork}
        disabled={isSwitching}
        variant="outline"
        className="bg-gray-800 border-gray-700 hover:bg-gray-700"
      >
        <SwitchCamera className="w-4 h-4 mr-2" />
        {isSwitching ? 'Switching...' : isTestnet ? 'Testnet' : 'Mainnet'}
      </Button>

      {address ? (
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700">
          <span className="text-sm text-gray-300">
            {formatAddress(address)}
          </span>
          <a
            href={getExplorerUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      ) : (
        <Button
          onClick={connectWallet}
          disabled={isConnecting}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600"
        >
          <Wallet className="w-4 h-4 mr-2" />
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      )}
    </div>
  );
}