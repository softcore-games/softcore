'use client';

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
          <h1 className="mb-4 text-2xl font-bold">Connect Wallet to Mint NFTs</h1>
          <p className="mb-4 text-gray-600">
            You need to connect your wallet and switch to Core Network to mint NFTs.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <h1 className="mb-6 text-2xl font-bold">NFT Minting</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Available NFTs */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Available Items</h2>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="mb-2 font-semibold">Character Companion</h3>
                <p className="mb-4 text-sm text-gray-600">A unique AI companion for your journey</p>
                <Button onClick={() => mintNFT('companion')} disabled={loading} className="w-full">
                  {loading ? 'Minting...' : 'Mint Companion'}
                </Button>
              </Card>

              <Card className="p-4">
                <h3 className="mb-2 font-semibold">Special Item</h3>
                <p className="mb-4 text-sm text-gray-600">Unlock unique dialogue options</p>
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
            <Button onClick={fetchOwnedNFTs} variant="outline" className="mb-4 w-full">
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
                <p className="py-4 text-center text-gray-600">No NFTs owned yet</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
