"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { WalletIcon } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

interface WalletStatusProps {
  onConnectedChange: (connected: boolean) => void;
}

export function WalletStatus({ onConnectedChange }: WalletStatusProps) {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  useEffect(() => {
    onConnectedChange(isConnected);
  }, [isConnected, onConnectedChange]);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <div className="flex items-center gap-4">
      {isConnected && address ? (
        <>
          <span className="text-sm text-muted-foreground">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <Button variant="outline" onClick={handleDisconnect}>
            Disconnect
          </Button>
        </>
      ) : (
        <Button onClick={handleConnect}>
          <WalletIcon className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      )}
    </div>
  );
}