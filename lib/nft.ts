import { BrowserProvider, Contract } from 'ethers';
import nftAbi from '@/contracts/CoreNFT.json';

const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS!;

export async function mintNFT(
  tokenURI: string,
  provider: BrowserProvider
): Promise<string | null> {
  try {
    const signer = await provider.getSigner();
    const contract = new Contract(NFT_CONTRACT_ADDRESS, nftAbi.abi, signer);

    const tx = await contract.mint(tokenURI);
    const receipt = await tx.wait();

    const event = receipt.logs?.find((log: any) => log.eventName === 'Transfer');
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