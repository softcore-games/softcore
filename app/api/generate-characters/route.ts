import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

const characterImages = [
  "https://im.runware.ai/image/ii/330a9c93-aa23-4d43-9e15-c0a05d70ae35.WEBP",
  "https://im.runware.ai/image/ii/b254fd6f-1d6f-417c-b1c4-66438200cb83.WEBP",
  "https://im.runware.ai/image/ii/bc2a920f-3cbf-4aa1-8f6e-8fdc2043b275.WEBP",
  "https://im.runware.ai/image/ii/0e55e629-2ee8-4272-b494-6d04431bb613.WEBP",
  "https://im.runware.ai/image/ii/521c11fb-8e3f-4559-aa05-89110e6f70c9.WEBP",
  "https://im.runware.ai/image/ii/b36b09bf-4a4a-4131-8d97-ed49ce016fb3.WEBP",
  "https://im.runware.ai/image/ii/212f427c-07b6-42e0-bafe-ec6a8376c857.WEBP",
  "https://im.runware.ai/image/ii/d3148960-5737-4a7d-9021-6a6e3cfa21a5.WEBP",
  "https://im.runware.ai/image/ii/9e361d10-6000-4528-89ae-2b183e337af7.WEBP",
  "https://im.runware.ai/image/ii/d982b9e0-f730-49b6-8caa-60ac4be825c8.WEBP",
  "https://im.runware.ai/image/ii/02c096f5-5414-4d6e-9fa0-0bdff2b275c3.WEBP",
  "https://im.runware.ai/image/ii/b7ddd6bb-f827-4e4c-a0a3-33877bb04739.WEBP",
  "https://im.runware.ai/image/ii/c0904f22-93b7-4f9a-af2f-f333bea7f5f2.WEBP",
  "https://im.runware.ai/image/ii/13390183-f825-4f34-8308-d0f6b81b4fa3.WEBP",
  "https://im.runware.ai/image/ii/57970026-2d8f-4231-a7f7-ae16cbca3d98.WEBP",
  "https://im.runware.ai/image/ii/83616a54-40de-4d5c-a7a2-6fcb03d87f0a.WEBP",
  "https://im.runware.ai/image/ii/b7662c98-dd8b-4d32-aa1e-ae10842248fb.WEBP",
  "https://im.runware.ai/image/ii/bc1e653b-633d-484a-942c-a634eb0b705f.WEBP",
  "https://im.runware.ai/image/ii/19e11dea-5d83-43c8-a43b-460b6636e0fb.WEBP",
  "https://im.runware.ai/image/ii/50f254c1-a667-4926-9652-5e5461000f83.WEBP",
  "https://im.runware.ai/image/ii/6089cb87-ae92-42c5-9e38-a8328906668b.WEBP",
  "https://im.runware.ai/image/ii/86b1ffb9-0953-45a8-8b59-48a69435b545.WEBP",
  "https://im.runware.ai/image/ii/81f583f4-7123-4cff-b38d-92e0d43e9b0d.WEBP",
  "https://im.runware.ai/image/ii/3a44dfbe-e9c4-46d3-ae6e-7329ea8abec3.WEBP",
  "https://im.runware.ai/image/ii/f8a254e5-b9a6-412c-aeea-e183775cc5a8.WEBP",
  "https://im.runware.ai/image/ii/04970b70-3ace-45c5-86cd-5345b84ff16c.WEBP",
  "https://im.runware.ai/image/ii/3b9cdc69-b464-470a-b56d-b65241ad45b1.WEBP",
];

function getRandomImages(count: number) {
  const shuffled = [...characterImages].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export async function POST() {
  const headersList = headers();
  const apiKey = headersList.get("x-api-key");

  if (!apiKey) {
    return NextResponse.json({ error: "API key is required" }, { status: 401 });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are creating flirtatious and emotionally engaging characters for a romantic visual novel game. Each character should have a distinct personality that comes through in their way of speaking and interactions.",
          },
          {
            role: "user",
            content:
              "Generate 3 unique female characters for a romantic dating simulator. For each character create:\n" +
              "1. A charming name that reflects their personality\n" +
              "2. A flirtatious and emotionally expressive personality trait (playful, seductive, mysterious, etc.)\n" +
              "3. An intriguing background that makes them romantically interesting\n" +
              'Make them diverse in personality and speaking style. They should feel like real people with genuine emotions and desires. Return ONLY valid JSON array with this format: [{"name": "Name", "personality": "Flirtatious personality trait", "background": "Romantic background"}]',
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error("Failed to generate characters");
    }

    const data = await response.json();

    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid response from OpenAI");
    }

    let characters;
    try {
      const content = data.choices[0].message.content;
      const cleanContent = content.replace(/```json\n?|```|\n/g, "");
      characters = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("JSON Parse error:", parseError);
      throw new Error("Failed to parse character data");
    }

    const selectedImages = getRandomImages(3);
    const finalCharacters = await Promise.all(
      characters.map(async (char: any, index: number) => {
        const character = await prisma.character.create({
          data: {
            name: char.name,
            avatar: selectedImages[index],
            personality: char.personality,
            background: char.background,
            expressions: {
              happy: selectedImages[index],
              flirty: selectedImages[index],
              thoughtful: selectedImages[index],
              surprised: selectedImages[index],
              sad: selectedImages[index],
            },
          },
        });

        return {
          id: character.id,
          name: character.name,
          avatar: character.avatar,
          personality: character.personality,
          background: character.background,
          expressions: character.expressions,
        };
      })
    );

    return NextResponse.json({ characters: finalCharacters });
  } catch (error) {
    console.error("Error in generate-characters:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate characters",
      },
      { status: 500 }
    );
  }
}
