import React, { useState } from 'react';
import { ethers } from 'ethers';
import { GrDownload } from 'react-icons/gr';
import { useWallet } from '@/lib/contexts/WalletContext';

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
        throw new Error('NFT contract address is not configured');
      }

      // Create and upload metadata
      const metadata = {
        name: scene.title,
        description: scene.content,
        image: scene.imageUrl,
        attributes: [
          {
            trait_type: 'Scene ID',
            value: scene.id,
          },
        ],
      };

      const response = await fetch('/api/upload-metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
      });

      if (!response.ok) {
        throw new Error('Failed to upload metadata to IPFS');
      }

      const { uri } = await response.json();

      // Mint the NFT
      const abi = ['function safeMint(address to, string memory uri) public'];
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.safeMint(walletAddress, uri);
      const receipt = await tx.wait();

      // Save the transaction details
      const saveResponse = await fetch('/api/nft-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sceneId: scene.id,
          tokenId: receipt.events[0].args.tokenId.toString(),
          contractAddress,
          transactionHash: receipt.transactionHash,
          ipfsUri: uri,
        }),
      });

      if (!saveResponse.ok) {
        console.error('Failed to save NFT transaction');
      }

      await onMint();
    } catch (error) {
      console.error('Failed to mint scene:', error);
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
          ? 'bg-gray-300 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600'
      } text-white font-semibold`}
    >
      <GrDownload className="mr-1 sm:mr-2 w-2.5 h-2.5 sm:w-3 sm:h-3" />
      {isMinting ? 'Minting...' : scene.nftMinted ? 'Minted' : 'Mint NFT'}
    </button>
  );
}

export default Mint;
