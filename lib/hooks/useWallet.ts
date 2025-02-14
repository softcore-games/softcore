"use client";

import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { CORE_TESTNET_CONFIG } from '../core-config';

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
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      setAccount(accounts[0]);
      
      // Check if we're on Core network
      await checkNetwork();
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      // Handle user rejection gracefully
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
      // Try to switch to Core network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CORE_TESTNET_CONFIG.chainId }],
      });
    } catch (switchError: any) {
      // If the chain hasn't been added, add it
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
    // Check initial connection status
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            checkNetwork();
          }
        })
        .catch(err => {
          console.error('Failed to get accounts:', err);
          setError('Failed to check wallet connection');
        });

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
        setError(null);
      });

      // Listen for chain changes
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
    error
  };
}