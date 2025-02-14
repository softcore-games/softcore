"use client";

import { useCallback } from 'react';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { CORE_TESTNET_CONFIG } from '../core-config';

export function useCore() {
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const switchToCore = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('No ethereum wallet found');
    }

    try {
      // First try to switch to Core network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CORE_TESTNET_CONFIG.chainId }],
      });
    } catch (switchError: any) {
      // If the chain hasn't been added to MetaMask, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [CORE_TESTNET_CONFIG],
          });
        } catch (addError) {
          throw new Error('Failed to add Core network');
        }
      } else {
        throw new Error('Failed to switch to Core network');
      }
    }
  }, []);

  const isConnectedToCore = chain?.id === parseInt(CORE_TESTNET_CONFIG.chainId, 16);

  return {
    switchToCore,
    isConnectedToCore,
  };
}