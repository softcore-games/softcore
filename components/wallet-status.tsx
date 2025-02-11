"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { WalletIcon } from "lucide-react";

interface WalletStatusProps {
  onConnectedChange: (connected: boolean) => void;
}

export function WalletStatus({ onConnectedChange }: WalletStatusProps) {
  const [address, setAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    // TODO: Implement actual wallet connection
    const mockAddress = "0x1234...5678";
    setAddress(mockAddress);
    onConnectedChange(true);
  };

  const disconnectWallet = () => {
    setAddress(null);
    onConnectedChange(false);
  };

  return (
    <div className="flex items-center gap-4">
      {address ? (
        <>
          <span className="text-sm text-muted-foreground">{address}</span>
          <Button variant="outline" onClick={disconnectWallet}>
            Disconnect
          </Button>
        </>
      ) : (
        <Button onClick={connectWallet}>
          <WalletIcon className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      )}
    </div>
  );
}