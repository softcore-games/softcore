import { NextResponse } from "next/server";
import { ethers } from "ethers";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS!;
const NFT_CONTRACT_ABI = [
  "function safeMint(address to, string memory uri) public",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "function totalSupply() public view returns (uint256)",
];

export async function POST(request: Request) {
  try {
    const headersList = headers();
    const apiKey = headersList.get("x-api-key");

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 401 }
      );
    }

    const { sceneId, imageUrl, characterName, metadata, walletAddress } =
      await request.json();

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    // Store NFT metadata in the database
    const nftData = await prisma.nFT.create({
      data: {
        sceneId,
        imageUrl,
        characterName,
        walletAddress,
        metadata: JSON.parse(JSON.stringify(metadata)), // Convert to plain JSON
      },
    });

    // Initialize provider and wallet
    const provider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.coredao.org"
    );
    const privateKey = process.env.MINTER_PRIVATE_KEY!;
    const wallet = new ethers.Wallet(privateKey, provider);

    // Connect to the NFT contract
    const nftContract = new ethers.Contract(
      NFT_CONTRACT_ADDRESS,
      NFT_CONTRACT_ABI,
      wallet
    );

    // Mint the NFT
    const tx = await nftContract.safeMint(
      walletAddress,
      `ipfs://${nftData.id}` // You'll need to implement IPFS storage for the metadata
    );

    // Wait for transaction confirmation
    const receipt = await tx.wait();

    // Update the database record with the transaction hash
    const updatedNft = await prisma.nFT.update({
      where: { id: nftData.id },
      data: { tokenId: receipt.hash },
    });

    return NextResponse.json({
      success: true,
      nft: updatedNft,
      transaction: receipt.hash,
    });
  } catch (error) {
    console.error("Error in mint-nft:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to mint NFT",
      },
      { status: 500 }
    );
  }
}
