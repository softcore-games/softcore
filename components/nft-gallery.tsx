"use client";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import SoftCoreNFTAbi from "@/abis/SoftCoreNFT.json";
import Loading from "@/components/loading";

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

        const provider = new ethers.JsonRpcProvider(
          process.env.NEXT_PUBLIC_CORE_DAO_RPC
        );
        const contract = new ethers.Contract(
          contractAddress,
          SoftCoreNFTAbi.abi,
          provider
        );

        // Get the total supply of tokens (if your contract has this function)
        // If not, we'll keep the current approach of searching until we find a gap
        let totalSupply;
        try {
          totalSupply = await contract.totalSupply();
        } catch (error) {
          console.warn(
            "Contract doesn't have totalSupply function, using fallback method"
          );
          totalSupply = null;
        }

        const nftPromises = [];

        if (totalSupply) {
          // If we have totalSupply, we can iterate directly
          for (let i = 0; i < totalSupply; i++) {
            nftPromises.push(fetchNFTData(contract, i));
          }
        } else {
          // Fallback: Search until we find a gap in token IDs
          let tokenId = 0;
          let consecutiveFailures = 0;
          const MAX_CONSECUTIVE_FAILURES = 5; // Stop after 5 consecutive non-existent tokens

          while (consecutiveFailures < MAX_CONSECUTIVE_FAILURES) {
            try {
              await contract.ownerOf(tokenId);
              nftPromises.push(fetchNFTData(contract, tokenId));
              consecutiveFailures = 0;
            } catch (error) {
              consecutiveFailures++;
            }
            tokenId++;
          }
        }

        const nftData = (await Promise.all(nftPromises)).filter(
          (nft): nft is NFT => nft !== null
        );

        // Sort NFTs by token ID in descending order (newest first)
        nftData.sort((a, b) => parseInt(b.tokenId) - parseInt(a.tokenId));

        setNfts(nftData);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllNFTs();
  }, []);

  // Helper function to fetch individual NFT data
  const fetchNFTData = async (contract: ethers.Contract, tokenId: number) => {
    try {
      const owner = await contract.ownerOf(tokenId);
      const uri = await contract.tokenURI(tokenId);
      const base64Data = uri.replace("data:application/json;base64,", "");
      const metadata = JSON.parse(atob(base64Data));

      return {
        tokenId: tokenId.toString(),
        owner,
        metadata,
      };
    } catch (error) {
      console.warn(`Failed to fetch NFT ${tokenId} data:`, error);
      return null;
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            SoftCORE NFT Gallery
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Browse all minted SoftCORE story moments
          </p>
        </div>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {nfts.map((nft) => (
            <div
              key={nft.tokenId}
              className="bg-gray-800 rounded-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border border-gray-700"
            >
              {/* Image Container */}
              <div className="relative aspect-square">
                <img
                  src={nft.metadata.image}
                  alt={nft.metadata.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                  <p className="text-sm text-yellow-400 font-mono">
                    #{nft.tokenId}
                  </p>
                </div>
              </div>

              {/* NFT Details */}
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2 truncate">
                  {nft.metadata.name}
                </h3>
                <p className="text-gray-400 text-sm h-10 overflow-hidden">
                  {nft.metadata.description}
                </p>

                {/* Owner Info */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Owner</p>
                      <p className="text-sm text-white font-mono">
                        {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
                      </p>
                    </div>
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-black font-bold">SC</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {nfts.length === 0 && (
          <div className="text-center py-20 bg-gray-800/50 rounded-2xl">
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-yellow-400 font-bold">SC</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No NFTs Found
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Be the first to mint a story moment as an NFT during gameplay!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NFTGallery;
