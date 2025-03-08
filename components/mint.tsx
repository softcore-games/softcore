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

      // Create metadata URI directly with scene data
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

      // Convert metadata to base64 encoded URI
      const uri = `data:application/json;base64,${Buffer.from(
        JSON.stringify(metadata)
      ).toString("base64")}`;

      // Mint the NFT
      const abi = ["function safeMint(address to, string memory uri) public"];
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.safeMint(walletAddress, uri);
      const receipt = await tx.wait();

      console.log("Mint transaction receipt:", receipt);

      // Get the token ID from logs
      const tokenId = receipt.logs[0].topics[3]; // The token ID is in the last topic
      console.log("Token ID:", tokenId);

      // Log the data we're about to send
      const transactionData = {
        sceneId: scene.id,
        tokenId: parseInt(tokenId, 16).toString(), // Convert hex to decimal string
        contractAddress: contractAddress,
        transactionHash: receipt.hash,
        ipfsUri: uri,
      };
      console.log("Saving transaction data:", transactionData);

      // Save the transaction details
      const saveResponse = await fetch("/api/nft-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      // Log the response
      console.log("Save response status:", saveResponse.status);
      const responseData = await saveResponse.json();
      console.log("Save response data:", responseData);

      if (!saveResponse.ok) {
        throw new Error(
          `Failed to save NFT transaction: ${JSON.stringify(responseData)}`
        );
      }

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
      className={`flex items-center justify-center px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs sm:text-sm ${
        isMinting || scene.nftMinted || !signer
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600"
      } text-white font-semibold`}
    >
      <GrDownload className="mr-1 sm:mr-2 w-2.5 h-2.5 sm:w-3 sm:h-3" />
      {isMinting ? "Minting..." : scene.nftMinted ? "Minted" : "Mint NFT"}
    </button>
  );
}

export default Mint;
