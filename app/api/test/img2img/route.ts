import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_AI_KEY,
});

export async function POST(req: Request) {
  try {
    if (!process.env.FAL_AI_KEY) {
      throw new Error("FAL_AI_KEY is not configured");
    }

    const { imageUrl, prompt } = await req.json();

    if (!imageUrl || !prompt) {
      return NextResponse.json(
        { error: "Image URL and prompt are required" },
        { status: 400 }
      );
    }

    console.log("Starting image generation with:", { imageUrl, prompt });

    const result = await fal.subscribe("fal-ai/flux/dev/image-to-image", {
      input: {
        image_url: imageUrl,
        prompt: prompt,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("Processing:", update.logs.map((log) => log.message));
        }
      },
    });

    console.log("Generation completed:", result);

    if (!result.data?.images?.[0]?.url) {
      throw new Error("No image URL in response");
    }

    return NextResponse.json({
      status: "completed",
      output: result.data.images.map((img) => img.url),
    });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}