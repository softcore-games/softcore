import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_AI_KEY,
});

export async function generateEnhancedImage(
  baseImageUrl: string,
  prompt: string
) {
  try {
    const result = await fal.subscribe("fal-ai/flux/dev/image-to-image", {
      input: {
        image_url: baseImageUrl,
        prompt: `Create a romantic visual novel scene with this character: ${prompt}`,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log(
            "Processing:",
            update.logs.map((log) => log.message)
          );
        }
      },
    });

    if (!result.data?.images?.[0]?.url) {
      throw new Error("No image URL in response");
    }

    return result.data.images[0].url;
  } catch (error) {
    console.error("Error generating enhanced image:", error);
    throw error;
  }
}

export async function updateSceneImage(
  sceneId: string,
  baseImageUrl: string,
  sceneContent: string
) {
  try {
    const enhancedImage = await generateEnhancedImage(
      baseImageUrl,
      `Create a romantic visual novel scene: ${sceneContent}`
    );

    const response = await fetch(`/api/scene/update-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sceneId,
        imageUrl: enhancedImage,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update scene image");
    }

    return enhancedImage;
  } catch (error) {
    console.error("Error updating scene image:", error);
    throw error;
  }
}
