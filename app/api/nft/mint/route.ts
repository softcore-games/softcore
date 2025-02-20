import { NextResponse } from "next/server";
import { ethers } from "ethers";
import { prisma } from "@/lib/prisma";
import SoftcoreNFT from "@/contracts/SoftcoreNFT.json";

const CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const RPC_URL = process.env.CORE_TESTNET_RPC_URL!;

export async function POST(req: Request) {
  if (!CONTRACT_ADDRESS || !PRIVATE_KEY || !RPC_URL) {
    return NextResponse.json(
      { error: "Missing environment variables" },
      { status: 500 }
    );
  }

  try {
    const { userAddress, tokenUri } = await req.json();

    // Connect to the network
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      SoftcoreNFT.abi,
      wallet
    );

    // Mint the NFT
    const tx = await contract.safeMint(userAddress, tokenUri);
    const receipt = await tx.wait();

    // Get the token ID from the event
    const mintEvent = receipt.logs.find(
      (log: any) =>
        log.topics[0] === ethers.id("Transfer(address,address,uint256)")
    );
    const tokenId = parseInt(mintEvent.topics[3], 16);

    return NextResponse.json({
      success: true,
      tokenId,
      txHash: receipt.hash,
    });
  } catch (error) {
    console.error("Minting error:", error);
    return NextResponse.json({ error: "Failed to mint NFT" }, { status: 500 });
  }
}
