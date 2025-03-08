import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sceneId, tokenId, contractAddress, transactionHash, ipfsUri } =
      await req.json();

    // Validate required fields
    if (
      !sceneId ||
      !tokenId ||
      !contractAddress ||
      !transactionHash ||
      !ipfsUri
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the NFT transaction record
    const transaction = await prisma.nFTTransaction.create({
      data: {
        sceneId,
        tokenId,
        contractAddress,
        transactionHash,
        ipfsUri,
        userId: user.id,
      },
    });

    // Update the scene to mark it as minted
    await prisma.scene.update({
      where: { id: sceneId },
      data: {
        nftMinted: true,
        nftTokenId: tokenId,
      },
    });

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (error) {
    console.error("Failed to save NFT transaction:", error);
    return NextResponse.json(
      {
        error: "Failed to save NFT transaction",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transactions = await prisma.nFTTransaction.findMany({
      where: { userId: user.id },
      include: { scene: true },
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Failed to fetch NFT transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch NFT transactions" },
      { status: 500 }
    );
  }
}
