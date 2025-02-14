'use client';

import { WagmiConfig } from 'wagmi';
import { wagmiConfig, Web3ModalProvider } from '@/lib/wagmi';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <Web3ModalProvider>{children}</Web3ModalProvider>
    </WagmiConfig>
  );
}
