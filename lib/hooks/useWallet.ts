'use client';

import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { CORE_TESTNET_CONFIG } from '../core-config';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnectedToCore, setIsConnectedToCore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkNetwork = useCallback(async () => {
    if (window.ethereum) {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setIsConnectedToCore(chainId === CORE_TESTNET_CONFIG.chainId);
        setError(null);
      } catch (err) {
        console.error('Failed to check network:', err);
        setError('Failed to check network status');
      }
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask or another Web3 wallet');
      return;
    }

    try {
      setError(null);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccount(accounts[0]);

      await checkNetwork();
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      if (error.code === 4001) {
        setError('Connection request was cancelled');
      } else {
        setError('Failed to connect wallet. Please try again.');
      }
    }
  }, [checkNetwork]);

  const switchToCore = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      setError(null);
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CORE_TESTNET_CONFIG.chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [CORE_TESTNET_CONFIG],
          });
        } catch (addError: any) {
          console.error('Failed to add Core network:', addError);
          if (addError.code === 4001) {
            setError('Network change was cancelled');
          } else {
            setError('Failed to add Core network');
          }
        }
      } else if (switchError.code === 4001) {
        setError('Network change was cancelled');
      } else {
        setError('Failed to switch to Core network');
      }
    }

    await checkNetwork();
  }, [checkNetwork]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_accounts' })
        .then((accounts) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            checkNetwork();
          }
        })
        .catch((err) => {
          console.error('Failed to get accounts:', err);
          setError('Failed to check wallet connection');
        });

      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
        setError(null);
      });

      window.ethereum.on('chainChanged', () => {
        checkNetwork();
        setError(null);
      });
    }
  }, [checkNetwork]);

  return {
    account,
    isConnectedToCore,
    connectWallet,
    switchToCore,
    error,
  };
}
