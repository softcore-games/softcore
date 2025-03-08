"use client";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import SoftCoreNFTAbi from "@/abis/SoftCoreNFT.json";

interface NFT {
  tokenId: string;
  owner: string;
  metadata: {
    name: string;
    description: string;
    image: string;
  };
}

function NFTGallery() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllNFTs = async () => {
      try {
        const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
        if (!contractAddress) {
          throw new Error("Contract address not configured");
        }

        // Create a provider
        const provider = new ethers.JsonRpcProvider(
          process.env.NEXT_PUBLIC_CORE_DAO_RPC
        );

        // Create contract instance
        const contract = new ethers.Contract(
          contractAddress,
          SoftCoreNFTAbi.abi,
          provider
        );

        // Instead of trying to get nextTokenId, let's try a different approach
        // We'll fetch NFTs one by one until we hit an error
        const nftPromises = [];
        let tokenId = 0;
        let continueSearching = true;

        while (continueSearching) {
          try {
            const owner = await contract.ownerOf(tokenId);
            nftPromises.push(
              (async (id) => {
                try {
                  const uri = await contract.tokenURI(id);
                  // Remove the data:application/json;base64, prefix and decode
                  const base64Data = uri.replace(
                    "data:application/json;base64,",
                    ""
                  );
                  const metadata = JSON.parse(atob(base64Data));

                  return {
                    tokenId: id.toString(),
                    owner,
                    metadata,
                  };
                } catch (error) {
                  console.warn(`Failed to fetch NFT ${id} metadata:`, error);
                  return null;
                }
              })(tokenId)
            );
            tokenId++;
          } catch (error) {
            // If we get an error (likely "owner query for nonexistent token"),
            // we've reached the end of our tokens
            continueSearching = false;
          }
        }

        const nftData = (await Promise.all(nftPromises)).filter(
          (nft): nft is NFT => nft !== null
        );

        setNfts(nftData);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllNFTs();
  }, []);

  if (loading) {
    return <div>Loading all minted NFTs...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {nfts.map((nft) => (
        <div key={nft.tokenId} className="border rounded-lg p-4 shadow-md">
          <img
            src={nft.metadata.image}
            alt={nft.metadata.name}
            className="w-full h-48 object-cover rounded-md"
          />
          <h3 className="mt-2 font-semibold">{nft.metadata.name}</h3>
          <p className="text-sm text-gray-600">{nft.metadata.description}</p>
          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-500">Token ID: {nft.tokenId}</p>
            <p className="text-xs text-gray-500">
              Owner: {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
            </p>
          </div>
        </div>
      ))}
      {nfts.length === 0 && (
        <div className="col-span-full text-center text-gray-500">
          No NFTs have been minted yet
        </div>
      )}
    </div>
  );
}

export default NFTGallery;
