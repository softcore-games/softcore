import { ethers } from 'ethers';
import nftAbi from '@/contracts/CoreNFT.json';

const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS!;

export async function mintNFT(
  tokenURI: string,
  provider: ethers.providers.Web3Provider
): Promise<string | null> {
  try {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, nftAbi, signer);

    const tx = await contract.mint(tokenURI);
    const receipt = await tx.wait();

    const event = receipt.events?.find((e: any) => e.event === 'Transfer');
    if (event) {
      const tokenId = event.args.tokenId.toString();
      return tokenId;
    }

    return null;
  } catch (error) {
    console.error('NFT minting error:', error);
    return null;
  }
}

export async function uploadMetadata(
  name: string,
  description: string,
  imageUrl: string
): Promise<string | null> {
  try {
    const metadata = {
      name,
      description,
      image: imageUrl,
      attributes: [
        {
          trait_type: 'Type',
          value: 'Scene',
        },
        {
          trait_type: 'Created',
          value: new Date().toISOString(),
        },
      ],
    };

    const response = await fetch('/api/nft/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });

    if (response.ok) {
      const data = await response.json();
      return data.url;
    }

    return null;
  } catch (error) {
    console.error('Metadata upload error:', error);
    return null;
  }
}