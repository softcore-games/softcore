import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { uploadMetadata } from '@/lib/nft';

async function getUser(token: string) {
  try {
    const decoded = verify(token, process.env.NEXTAUTH_SECRET!) as {
      userId: string;
    };
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = await getUser(token);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { imageUrl, metadata } = await req.json();

    if (!imageUrl || !metadata) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upload metadata to IPFS
    const tokenURI = await uploadMetadata(
      metadata.name,
      metadata.description,
      imageUrl
    );

    if (!tokenURI) {
      return NextResponse.json(
        { error: 'Failed to upload metadata' },
        { status: 500 }
      );
    }

    // Record the NFT mint
    const nft = await prisma.nFTMint.create({
      data: {
        userId,
        tokenId: '0', // Will be updated after minting
        metadata: metadata,
        txHash: '', // Will be updated after minting
      },
    });

    return NextResponse.json({
      tokenURI,
      nftId: nft.id,
    });
  } catch (error) {
    console.error('NFT minting error:', error);
    return NextResponse.json(
      { error: 'Failed to mint NFT' },
      { status: 500 }
    );
  }
}