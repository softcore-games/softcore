"use client";

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createConfig } from 'wagmi';
import { coreTestnet } from './chains';

const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID';

const chains = [coreTestnet];

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

export const ethereumClient = new EthereumClient(wagmiConfig, chains);

export function Web3ModalProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeMode="dark"
      />
    </>
  );
}