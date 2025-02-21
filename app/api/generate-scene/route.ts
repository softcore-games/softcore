import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

interface Scene {
  message: string;
  choices: Array<{
    text: string;
    relationshipImpact: number;
  }>;
  selectedChoice: number | null;
  mood?: string;
  imageURL?: string;
}

interface ConversationContext {
  message: string;
  choice: string | null;
}

interface Choice {
  text: string;
  relationshipImpact: number;
}

export async function POST(request: Request) {
  const headersList = headers();
  const apiKey = headersList.get("x-api-key");
  const characterId = headersList.get("x-character-id");

  if (!apiKey) {
    console.log("API key missing");
    return NextResponse.json({ error: "API key is required" }, { status: 401 });
  }

  try {
    const { currentScene, selectedChoice, history } = await request.json();
    console.log("Request body:", {
      currentScene: currentScene?.id,
      selectedChoice,
      historyLength: history?.length,
    });

    // Create a more detailed context from the conversation history
    const lastFewScenes = (history as Scene[]).slice(-3);
    console.log(
      "Last few scenes:",
      lastFewScenes.map((scene) => ({
        message: scene.message?.substring(0, 50) + "...",
        hasChoices: !!scene.choices?.length,
        selectedChoice: scene.selectedChoice,
        mood: scene.mood,
      }))
    );

    const conversationContext: ConversationContext[] = lastFewScenes.map(
      (scene: Scene) => ({
        message: scene.message,
        choice:
          scene.selectedChoice !== null &&
          scene.choices &&
          scene.choices[scene.selectedChoice]
            ? scene.choices[scene.selectedChoice].text
            : null,
      })
    );

    const emotionalContext = lastFewScenes
      .map((scene: Scene) => scene.mood)
      .filter(Boolean)
      .join(", ");
    console.log("Emotional context:", emotionalContext);

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
        (ctx: ConversationContext) =>
          `${ctx.message}${ctx.choice ? ` (Player chose: ${ctx.choice})` : ""}`
      )
      .join("\n");
    console.log("Conversation summary:", conversationSummary);

    console.log("Sending request to OpenAI for message generation...");
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
    console.log("OpenAI message response:", {
      status: response.status,
      ok: response.ok,
      error: data.error,
      content: data.choices?.[0]?.message?.content?.substring(0, 100) + "...",
    });

    if (!response.ok) {
      throw new Error(data.error?.message ?? "Failed to generate scene");
    }

    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid response from OpenAI: missing message content");
    }

    let generatedMessage = data.choices[0].message.content.trim();

    // More aggressive cleaning of the message
    generatedMessage = generatedMessage
      .replace(/undefined|null/g, "") // Remove undefined/null strings
      .replace(/\s+/g, " ") // Normalize whitespace
      .replace(/\.{2,}/g, ".") // Replace multiple dots with single dot
      .replace(/([^.!?])$/, "$1."); // Add period if missing final punctuation

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
    console.log("OpenAI choices response:", {
      status: choicesResponse.status,
      ok: choicesResponse.ok,
      error: choicesData.error,
      content: choicesData.choices?.[0]?.message?.content,
    });

    if (!choicesData.choices?.[0]?.message?.content) {
      throw new Error("Invalid response from OpenAI: missing choices content");
    }

    // Clean and validate choices
    const choices = choicesData.choices[0].message.content
      .split("\n")
      .filter(Boolean)
      .map((choice: string) => {
        const cleanedText = choice
          .replace(/^\d+\.\s*/, "") // Remove numbering
          .replace(/undefined|null/g, "") // Remove undefined/null strings
          .trim();
        return {
          text: cleanedText,
          relationshipImpact: Math.floor(Math.random() * 3) + 1,
        };
      })
      .filter((choice: Choice) => {
        // Validate choice text
        return (
          choice.text &&
          choice.text.length > 0 &&
          choice.text.split(" ").length <= 8
        );
      });

    // Ensure we have at least one valid choice
    if (choices.length === 0) {
      throw new Error("No valid choices generated");
    }

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

    const sceneData = {
      message: generatedMessage || "...", // Fallback if message is empty
      choices: choices.slice(0, 3),
      mood: determinedMood || "thoughtful", // Fallback mood
      imageURL: currentScene?.imageURL || null,
    };

    const scene = await prisma.scene.create({
      data: sceneData,
    });

    // Validate response data
    const responseData = {
      message: scene.message,
      choices: Array.isArray(scene.choices) ? scene.choices : [],
      mood: scene.mood || "thoughtful",
      imageURL: scene.imageURL || null,
    };

    console.log(responseData, "responseData");

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error in generate-scene:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
