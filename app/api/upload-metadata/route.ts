import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const metadata = await req.json();
    const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY;

    if (!NFT_STORAGE_KEY) {
      throw new Error("NFT.Storage API key not configured");
    }

    // Create a blob with the metadata
    const blob = new Blob([JSON.stringify(metadata)], {
      type: "application/json",
    });

    // Upload to NFT.Storage using their HTTP API
    const response = await fetch("https://api.nft.storage/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NFT_STORAGE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(metadata),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("NFT.Storage API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      throw new Error(
        `Upload failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const cid = data.value.cid;
    const uri = `ipfs://${cid}`;

    return NextResponse.json({ uri }, { status: 200 });
  } catch (error) {
    console.error("Upload to IPFS failed:", error);
    return NextResponse.json(
      {
        error: "Failed to upload metadata to IPFS",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
