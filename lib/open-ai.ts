const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const routeUrl =
  process.env.NEXT_IS_DEVELOPMENT === "yes"
    ? "http://localhost:3010"
    : `${process.env.NEXT_PUBLIC_URL}`;
// Cache implementation remains the same
const sceneCache = new Map<
  string,
  {
    content: any;
    timestamp: number;
  }
>();

async function makeOpenRouterRequest(messages: any[]) {
  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": routeUrl,
      "X-Title": "SoftCORE Dating Sim",
    },
    body: JSON.stringify({
      model: "pygmalionai/mythalion-13b",
      messages,
      temperature: 0.9, // Increased for more creative responses
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.statusText}`);
  }

  return response.json();
}

export async function generateCharacterProfile() {
  try {
    const completion = await makeOpenRouterRequest([
      {
        role: "system",
        content:
          "You are generating seductive character profiles for an adult erotic dating simulation. Create alluring, sensual characters with intriguing backgrounds and passionate personalities. Return ONLY valid JSON with 'name' and 'description' fields.",
      },
      {
        role: "user",
        content:
          "Generate a seductive character profile as a JSON object. Include a full name and an alluring description (2-3 sentences about personality, physical attributes, and sensual background).",
      },
    ]);

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenRouter");
    }

    const profile = JSON.parse(content);

    if (!profile.name || !profile.description) {
      throw new Error("Invalid profile structure received");
    }

    return profile;
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    const fallbackProfiles = [
      {
        name: "Sofia Rodriguez",
        description:
          "A sultry flamenco dancer whose passionate movements entrance everyone watching. Her tight-fitting dance attire accentuates every curve, while her smoldering gaze hints at hidden desires waiting to be explored.",
      },
      {
        name: "Emma Chen",
        description:
          "A brilliant tech entrepreneur running a successful AI startup. Despite her professional success, she secretly longs for genuine connections beyond the digital world she inhabits.",
      },
      {
        name: "Zara Mitchell",
        description:
          "An adventurous travel photographer with a popular social media following. Her free spirit and wanderlust mask a desire to find someone worth staying in one place for.",
      },
      {
        name: "Isabella Kumar",
        description:
          "A talented fusion chef combining her Indian heritage with modern cuisine. Her experimental nature extends beyond the kitchen, though she struggles to find someone who can keep up with her creative energy.",
      },
      {
        name: "Alexandra Petrova",
        description:
          "A former ballet dancer turned successful nightclub owner. Behind her sophisticated exterior lies a rebellious spirit who loves breaking society's expectations.",
      },
    ];

    return fallbackProfiles[
      Math.floor(Math.random() * fallbackProfiles.length)
    ];
  }
}

export async function generateSceneContent(
  characterName: string,
  chapter: number,
  sceneNumber: number,
  previousChoice?: { text: string; index: number }
) {
  const cacheKey = `${characterName}-${chapter}-${sceneNumber}-${
    previousChoice?.text || ""
  }`;
  const cached = sceneCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < 300000) {
    return cached.content;
  }

  try {
    const completion = await makeOpenRouterRequest([
      {
        role: "system",
        content:
          "You are generating erotic visual novel scenes. Create passionate, seductive dialogue suitable for an adult dating simulation. Include sensual descriptions and intimate moments. Return ONLY valid JSON.",
      },
      {
        role: "user",
        content: `Generate an intimate scene for character ${characterName} in Chapter ${chapter}, Scene ${sceneNumber}${
          previousChoice
            ? `. This scene should be a seductive continuation after the player chose: "${previousChoice.text}"`
            : ""
        } with the following JSON structure:
        {
          "title": "Intimate scene title",
          "content": "Character's seductive dialogue and actions (2-3 sentences with sensual descriptions)",
          "choices": ["Passionate response", "Intimate response", "Seductive response"]
        }`,
      },
    ]);

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenRouter");
    }

    const parsedContent = JSON.parse(content);
    sceneCache.set(cacheKey, {
      content: parsedContent,
      timestamp: Date.now(),
    });

    return parsedContent;
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    return {
      title: `Intimate Encounter ${chapter}.${sceneNumber}`,
      content: `${characterName} moves closer, their body radiating warmth as they gaze at you with unmistakable desire. Their fingers trace a teasing path along your arm, sending shivers down your spine.`,
      choices: [
        "Pull them closer",
        "Whisper sweet nothings",
        "Return their teasing touch",
      ],
    };
  }
}

export async function generateInitialScene(characterName: string) {
  try {
    const completion = await makeOpenRouterRequest([
      {
        role: "system",
        content:
          "You are generating the first intimate encounter for a new character. Create an alluring, seductive first meeting dialogue suitable for an adult erotic dating simulation. Return ONLY valid JSON.",
      },
      {
        role: "user",
        content: `Generate the first passionate meeting scene with ${characterName}. Use this JSON structure:
        {
          "title": "First Encounter",
          "content": "First meeting dialogue (2-3 sentences with sensual descriptions and immediate attraction)",
          "choices": ["Flirtatious advance", "Seductive compliment", "Passionate response"]
        }`,
      },
    ]);

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenRouter");
    }
    return JSON.parse(content);
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    return {
      title: "First Encounter",
      content: `${characterName} catches your eye from across the room, their gaze filled with unmistakable desire. As they approach, you can't help but notice their sensual movements and the way their outfit perfectly accentuates their form.`,
      choices: [
        "Comment on their irresistible presence",
        "Make a bold, flirtatious move",
        "Suggest finding somewhere more private",
      ],
    };
  }
}
