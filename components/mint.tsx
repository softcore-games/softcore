import React, { useState } from "react";
import { ethers } from "ethers";
import { GrDownload } from "react-icons/gr";
import { useWallet } from "@/lib/contexts/WalletContext";

interface MintProps {
  scene: {
    id: string;
    nftMinted: boolean;
    imageUrl: string;
    title: string;
    content: string;
  };
  onMint: () => Promise<void>;
}

function Mint({ scene, onMint }: MintProps) {
  const [isMinting, setIsMinting] = useState(false);
  const { signer, walletAddress } = useWallet();

  const handleMint = async () => {
    if (isMinting || scene.nftMinted || !signer || !walletAddress) return;

    setIsMinting(true);
    try {
      const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
      if (!contractAddress) {
        throw new Error("NFT contract address is not configured");
      }

      // Create metadata for the NFT
      const metadata = {
        name: scene.title,
        description: scene.content,
        image: scene.imageUrl,
        attributes: [
          {
            trait_type: "Scene ID",
            value: scene.id,
          },
        ],
      };

      // TODO: Implement IPFS upload later
      // const metadataUri = await uploadToIPFS(metadata);
      // const metadataUri = scene.imageUrl; // Temporarily use image URL directly

      const abi = ["function safeMint(address to, string memory uri) public"];
      await mintNFT(contractAddress, abi, signer, walletAddress, metadataUri);
      await onMint();
    } catch (error) {
      console.error("Failed to mint scene:", error);
    } finally {
      setIsMinting(false);
    }
  };

  async function uploadToIPFS(metadata: any): Promise<string> {
    try {
      const response = await fetch("/api/upload-metadata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metadata),
      });

      if (!response.ok) {
        throw new Error("Failed to upload metadata");
      }

      const data = await response.json();
      return data.uri;
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      throw error;
    }
  }

  async function mintNFT(
    contractAddress: string,
    abi: string[],
    signer: ethers.JsonRpcSigner,
    walletAddress: string,
    nftUri: string
  ) {
    try {
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.safeMint(walletAddress, nftUri);
      await tx.wait();
    } catch (error) {
      console.log("Error minting NFT:", error);
      throw error;
    }
  }

  return (
    <button
      onClick={handleMint}
      disabled={isMinting || scene.nftMinted || !signer || !walletAddress}
      className={`flex items-center bg-gray-50 border-2 border-black rounded-full pl-2 hover:shadow-md transition-all ${
        isMinting || scene.nftMinted || !signer || !walletAddress
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-gray-100"
      } group`}
    >
      <span className="font-semibold text-black text-xs sm:text-sm md:text-base">
        {scene.nftMinted
          ? "Minted"
          : isMinting
          ? "Minting..."
          : !signer || !walletAddress
          ? "Connect Wallet"
          : "MINT Scene"}
      </span>
      <span className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center bg-yellow-400 rounded-full border-2 border-black ml-2 group-hover:bg-yellow-500 transition-colors relative left-1">
        <GrDownload className="text-gray-800 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
      </span>
    </button>
  );
}

export default Mint;
