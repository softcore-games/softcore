'use client';

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createConfig } from 'wagmi';
import { coreTestnet } from './chains';
import { Fragment } from 'react';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

const { chains, publicClient } = configureChains(
  [coreTestnet],
  [w3mProvider({ projectId })]
);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains, version: 2 }),
  publicClient,
});

export const ethereumClient = new EthereumClient(wagmiConfig, chains);

interface Web3ModalProviderProps {
  children: React.ReactNode;
}

export function Web3ModalProvider({ children }: Web3ModalProviderProps) {
  return (
    <Fragment>
      {children}
      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeMode="dark"
        themeVariables={{
          '--w3m-font-family': 'Inter, sans-serif',
          '--w3m-accent-color': '#000000',
        }}
      />
    </Fragment>
  );
}