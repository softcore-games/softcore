"use client";

import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { CORE_TESTNET_CONFIG } from '../core-config';

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnectedToCore, setIsConnectedToCore] = useState(false);

  const checkNetwork = useCallback(async () => {
    if (window.ethereum) {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setIsConnectedToCore(chainId === CORE_TESTNET_CONFIG.chainId);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask or another Web3 wallet');
      return;
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      setAccount(accounts[0]);
      
      // Check if we're on Core network
      await checkNetwork();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  }, [checkNetwork]);

  const switchToCore = useCallback(async () => {
    if (!window.ethereum) return;

    try {
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
        } catch (addError) {
          console.error('Failed to add Core network:', addError);
        }
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
        });

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        checkNetwork();
      });
    }
  }, [checkNetwork]);

  return {
    account,
    isConnectedToCore,
    connectWallet,
    switchToCore
  };
}