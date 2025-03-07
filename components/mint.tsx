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

async function mintNFT(
  contractAddress: string,
  abi: string[],
  signer: ethers.Signer,
  to: string,
  uri: string
) {
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const tx = await contract.safeMint(to, uri);
  await tx.wait();
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

      // Upload metadata to IPFS
      const response = await fetch("/api/upload-metadata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metadata),
      });

      if (!response.ok) {
        throw new Error("Failed to upload metadata to IPFS");
      }

      const { uri } = await response.json();

      const abi = ["function safeMint(address to, string memory uri) public"];
      await mintNFT(contractAddress, abi, signer, walletAddress, uri);
      await onMint();
    } catch (error) {
      console.error("Failed to mint scene:", error);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <button
      onClick={handleMint}
      disabled={isMinting || scene.nftMinted || !signer}
      className={`flex items-center justify-center px-4 py-2 rounded ${
        isMinting || scene.nftMinted || !signer
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600"
      } text-white font-semibold`}
    >
      <GrDownload className="mr-2" />
      {isMinting ? "Minting..." : scene.nftMinted ? "Minted" : "Mint NFT"}
    </button>
  );
}

export default Mint;
