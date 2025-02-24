import { NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

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

    const {
      sceneId,
      imageUrl,
      characterName,
      metadata,
      walletAddress,
      network,
      transactionHash,
    } = await request.json();

    if (!walletAddress || !transactionHash) {
      return NextResponse.json(
        { error: "Wallet address and transaction hash are required" },
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
        network,
        metadata: JSON.parse(JSON.stringify(metadata)),
        transactionHash,
        status: "MINTED",
      },
    });

    return NextResponse.json({
      success: true,
      nft: nftData,
    });
  } catch (error) {
    console.error("Error saving NFT:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to save NFT data",
      },
      { status: 500 }
    );
  }
}

// Add a PATCH endpoint to update the transaction hash
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { transactionHash } = await request.json();

    const updatedNft = await prisma.nFT.update({
      where: { id: params.id },
      data: {
        transactionHash,
        status: "MINTED",
      },
    });

    return NextResponse.json({
      success: true,
      nft: updatedNft,
    });
  } catch (error) {
    console.error("Error updating NFT:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update NFT data",
      },
      { status: 500 }
    );
  }
}
