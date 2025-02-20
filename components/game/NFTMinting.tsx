"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export function NFTMinting() {
  const [isMinting, setIsMinting] = useState(false);
  const { toast } = useToast();

  const mintNFT = async () => {
    try {
      setIsMinting(true);

      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error("Please install MetaMask");
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const userAddress = accounts[0];

      // Example token URI - replace with your actual metadata
      const tokenUri = "ipfs://your-metadata-uri";

      const response = await fetch("/api/nft/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAddress, tokenUri }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      toast({
        title: "NFT Minted!",
        description: `Transaction hash: ${data.txHash}`,
      });
    } catch (error: any) {
      toast({
        title: "Minting Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-2xl font-bold">Mint Your Achievement NFT</h2>
      <Button onClick={mintNFT} disabled={isMinting}>
        {isMinting ? "Minting..." : "Mint NFT"}
      </Button>
    </div>
  );
}
