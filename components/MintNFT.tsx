"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { ethers } from "ethers";
import { useWallet } from "@/contexts/WalletContext";
import { toast } from "@/hooks/use-toast";
import MyNFTAbi from "@/abis/SoftCoreNFT.json";

interface MintNFTProps {
  sceneId: string;
  imageUrl: string;
  characterName: string;
  message: string;
  mood: string;
}

const MintNFT = ({
  sceneId,
  imageUrl,
  characterName,
  message,
  mood,
}: MintNFTProps) => {
  const [isMinting, setIsMinting] = useState(false);
  const { isTestnet } = useWallet();

  const handleMintNFT = async () => {
    try {
      setIsMinting(true);
      const { ethereum } = window;
      if (!ethereum) {
        toast({
          title: "MetaMask Required",
          description: "Please install MetaMask to mint NFTs",
          variant: "destructive",
        });
        return;
      }

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();

      // Use different contract addresses based on network
      const contractAddress = isTestnet
        ? process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS_TESTNET ||
          "0x383BA274Fd1436a5AF03C18b66c5E2127Ea6B4C1"
        : process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS_MAINNET;

      if (!contractAddress) {
        throw new Error("Contract address not configured for this network");
      }

      const contract = new ethers.Contract(
        contractAddress,
        MyNFTAbi.abi,
        signer
      );

      // Prepare metadata
      const metadata = {
        title: message.split(/[.!?]/)[0],
        description: message,
        character: characterName,
        mood: mood,
        image: imageUrl,
        timestamp: new Date().toISOString(),
      };

      // Create metadata URI
      const metadataUri = `data:application/json;base64,${btoa(
        JSON.stringify(metadata)
      )}`;

      // Mint the NFT
      const tx = await contract.safeMint(signer.address, metadataUri);

      toast({
        title: "Minting in Progress",
        description: "Please wait while your NFT is being minted...",
      });

      const receipt = await tx.wait();

      // Only save to database if minting was successful
      const saveResponse = await fetch("/api/mint-nft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
        },
        body: JSON.stringify({
          sceneId,
          imageUrl,
          characterName,
          metadata,
          walletAddress: signer.address,
          network: isTestnet ? "testnet" : "mainnet",
          transactionHash: receipt.hash,
        }),
      });

      if (!saveResponse.ok) {
        const error = await saveResponse.json();
        throw new Error(error.error || "Failed to save NFT data");
      }

      toast({
        title: "Success!",
        description: "Your scene has been minted as an NFT. Check your wallet!",
      });

      // Open the appropriate block explorer based on network
      const explorerUrl = isTestnet
        ? `https://scan.test.btcs.network/tx/${receipt.hash}`
        : `https://scan.coredao.org/tx/${receipt.hash}`;

      window.open(explorerUrl, "_blank");
    } catch (error) {
      console.error("NFT minting error:", error);
      toast({
        title: "Minting Failed",
        description:
          error instanceof Error ? error.message : "Failed to mint NFT",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <Button
      variant="default"
      size="lg"
      className="w-full bg-love-500 hover:bg-love-600 text-white"
      onClick={handleMintNFT}
      disabled={isMinting}
    >
      <Sparkles className="w-5 h-5 mr-2" />
      {isMinting ? "Minting..." : "Mint this Moment"}
    </Button>
  );
};

export default MintNFT;
