"use client";

import { useState } from 'react';
import { useWallet } from '@/lib/hooks/useWallet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ethers } from 'ethers';
import GameItems from '@/contracts/GameItems.json';

export default function NFTMinting() {
  const { account, isConnectedToCore } = useWallet();
  const [loading, setLoading] = useState(false);
  const [ownedNFTs, setOwnedNFTs] = useState<any[]>([]);

  const mintNFT = async (itemType: string) => {
    if (!account) return;
    setLoading(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_GAME_ITEMS_ADDRESS || '',
        GameItems.abi,
        signer
      );

      const tx = await nftContract.mintItem(
        account,
        itemType,
        `https://api.softcore.game/metadata/${itemType}.json`
      );
      await tx.wait();
      await fetchOwnedNFTs();
    } catch (error) {
      console.error('Error minting NFT:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOwnedNFTs = async () => {
    if (!account) return;

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const nftContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_GAME_ITEMS_ADDRESS || '',
        GameItems.abi,
        provider
      );

      const balance = await nftContract.balanceOf(account);
      const nfts = [];
      
      for (let i = 0; i < balance; i++) {
        const tokenId = await nftContract.tokenOfOwnerByIndex(account, i);
        const tokenType = await nftContract.getItemType(tokenId);
        nfts.push({ id: tokenId.toString(), type: tokenType });
      }

      setOwnedNFTs(nfts);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    }
  };

  if (!account || !isConnectedToCore) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">Connect Wallet to Mint NFTs</h1>
          <p className="text-gray-600 mb-4">
            You need to connect your wallet and switch to Core Network to mint NFTs.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">NFT Minting</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Available NFTs */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Available Items</h2>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Character Companion</h3>
                <p className="text-sm text-gray-600 mb-4">
                  A unique AI companion for your journey
                </p>
                <Button
                  onClick={() => mintNFT('companion')}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Minting...' : 'Mint Companion'}
                </Button>
              </Card>
              
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Special Item</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Unlock unique dialogue options
                </p>
                <Button
                  onClick={() => mintNFT('special_item')}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Minting...' : 'Mint Item'}
                </Button>
              </Card>
            </div>
          </div>

          {/* Owned NFTs */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Your NFTs</h2>
            <Button
              onClick={fetchOwnedNFTs}
              variant="outline"
              className="w-full mb-4"
            >
              Refresh NFTs
            </Button>
            
            <div className="space-y-2">
              {ownedNFTs.map((nft) => (
                <Card key={nft.id} className="p-4">
                  <h3 className="font-semibold">#{nft.id}</h3>
                  <p className="text-sm text-gray-600">{nft.type}</p>
                </Card>
              ))}
              
              {ownedNFTs.length === 0 && (
                <p className="text-gray-600 text-center py-4">
                  No NFTs owned yet
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}