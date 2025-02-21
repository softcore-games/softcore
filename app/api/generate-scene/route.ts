import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(request: Request) {
  const headersList = headers();
  const apiKey = headersList.get("x-api-key");
  const provider = headersList.get("x-provider");
  const characterId = headersList.get("x-character-id");

  if (!apiKey) {
    return NextResponse.json({ error: "API key is required" }, { status: 401 });
  }

  try {
    const { currentScene, selectedChoice, history } = await request.json();

    // Create a more detailed context from the conversation history
    const lastFewScenes = history.slice(-3);
    const conversationContext = lastFewScenes.map((scene) => ({
      message: scene.message,
      choice:
        scene.selectedChoice !== null
          ? scene.choices[scene.selectedChoice].text
          : null,
    }));

    const emotionalContext = lastFewScenes
      .map((scene) => scene.mood)
      .filter(Boolean)
      .join(", ");

    const systemPrompt = `You are ${characterId}, a romantic and emotionally engaging character in a dating simulation. 
Your responses should:
- Be flirtatious and romantically charged while maintaining appropriate boundaries
- Show genuine emotional depth and vulnerability
- React naturally to the player's choices and maintain conversation flow
- Express feelings through both words and subtle gestures
- Keep responses concise (2-4 sentences) but emotionally meaningful
- Consider the emotional progression of the conversation

Recent emotional states: ${emotionalContext}
Your personality is warm, engaging, and genuinely interested in the player.`;

    const conversationSummary = conversationContext
      .map(
        (ctx) =>
          `${ctx.message}${ctx.choice ? ` (Player chose: ${ctx.choice})` : ""}`
      )
      .join("\n");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Previous conversation:\n${conversationSummary}\n\nPlayer's last choice: ${selectedChoice}\n\nRespond naturally and flirtatiously to maintain the romantic atmosphere while considering our conversation history.`,
          },
        ],
        temperature: 0.8,
        max_tokens: 150,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message ?? "Failed to generate scene");
    }

    const generatedMessage = data.choices[0].message.content;

    // Generate choices using a separate API call
    const choicesResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content:
                "Generate 3 flirtatious and emotionally engaging response options (maximum 8 words each) that naturally progress the romantic conversation.",
            },
            {
              role: "user",
              content: `Context: ${generatedMessage}\n\nCreate romantic response choices that range from playful to sincere.`,
            },
          ],
          temperature: 0.7,
          max_tokens: 100,
        }),
      }
    );

    const choicesData = await choicesResponse.json();
    const choices = choicesData.choices[0].message.content
      .split("\n")
      .filter(Boolean)
      .map((choice) => ({
        text: choice.replace(/^\d+\.\s*/, "").trim(),
        relationshipImpact: Math.floor(Math.random() * 3) + 1,
      }))
      .filter((choice) => choice.text.split(" ").length <= 8);

    // Determine mood based on content
    const moodKeywords = {
      happy: ["smile", "laugh", "joy", "happy", "excited", "playful"],
      flirty: ["wink", "tease", "flirt", "playful", "charming"],
      thoughtful: ["think", "consider", "wonder", "reflect", "ponder"],
      surprised: ["gasp", "shock", "surprise", "unexpected", "amazed"],
      sad: ["sigh", "sad", "upset", "disappointed", "hurt"],
    };

    let determinedMood = "thoughtful";
    const lowerMessage = generatedMessage.toLowerCase();

    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
        determinedMood = mood;
        break;
      }
    }

    const scene = await prisma.scene.create({
      data: {
        message: generatedMessage,
        choices: choices.slice(0, 3),
        mood: determinedMood,
        imageURL: currentScene?.imageURL,
      },
    });

    return NextResponse.json({
      message: scene.message,
      choices: scene.choices,
      mood: scene.mood,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
