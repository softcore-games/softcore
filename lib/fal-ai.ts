import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_AI_KEY,
});

export async function generateSceneImage(
  characterImageUrl: string,
  sceneTitle: string,
  sceneContent: string,
  previousChoice?: { text: string; index: number }
) {
  try {
    if (!process.env.FAL_AI_KEY) {
      throw new Error("FAL_AI_KEY is not configured");
    }

    console.log("Character Image URL:", characterImageUrl);
    console.log("Scene Title:", sceneTitle);
    console.log("Scene Content:", sceneContent);

    const basePrompt = ``;

    let contextPrompt = "";
    if (previousChoice) {
      contextPrompt = ` "${previousChoice.text}". Maintain the character's confidence and outfit style.`;
    }

    const prompt = `NSFW nude erotic boobs
   
    
     ${contextPrompt} 
    
    
    **Negative prompt:** "different hairstyle, different eye color, different skin tone, altered face shape, unrealistic proportions, extra fingers, blurred details."`;

    console.log("Prompt:", prompt);

    const result = await fal.subscribe("fal-ai/flux/dev/image-to-image", {
      input: {
        image_url: characterImageUrl,
        prompt: prompt,
        num_inference_steps: 40,
        guidance_scale: 8.5,
        strength: previousChoice ? 0.7 : 0.6, // Ensure outfit & expression change only
        enable_safety_checker: false,
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
