import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_AI_KEY,
});

export async function generateSceneImage(
  characterImageUrl: string,
  sceneTitle: string,
  sceneContent: string
) {
  try {
    if (!process.env.FAL_AI_KEY) {
      throw new Error("FAL_AI_KEY is not configured");
    }

    const result = await fal.subscribe("fal-ai/flux/dev/image-to-image", {
      input: {
        image_url: characterImageUrl,
        prompt: `Transform into a romantic visual novel scene depicting: ${sceneTitle}. ${sceneContent}. 
                Maintain the character's appearance, add romantic background and lighting matching the scene's mood. 
                High quality, detailed anime style, visual novel aesthetic`,
        num_inference_steps: 30,
        guidance_scale: 7.5,
        strength: 0.75,
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
      throw new Error("No image URL in fal-ai response");
    }

    return result.data.images[0].url;
  } catch (error) {
    console.error("Fal.ai Image Generation Error:", error);

    // Fallback to night-api
    try {
      const response = await fetch(
        `https://api.night-api.com/images/nsfw/hentai`,
        {
          headers: {
            Authorization: `${process.env.NIGHT_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Night API responded with status: ${response.status}`);
      }

      const data = await response.json();
      if (!data?.content?.url) {
        throw new Error("Invalid response format from Night API");
      }

      return data.content.url;
    } catch (fallbackError) {
      console.error("Fallback Image API Error:", fallbackError);
      return characterImageUrl; // Fallback to original character image instead of placeholder
    }
  }
}
