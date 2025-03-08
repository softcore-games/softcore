import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

async function generateImg2Img(imageUrl: string, prompt: string) {
  const url = "https://api.monsterapi.ai/v1/generate/img2img";

  // Create form data with all required parameters
  const formData = new FormData();
  formData.append("prompt", prompt);
  formData.append("init_image_url", imageUrl);
  formData.append("guidance_scale", "7.5"); // Default value between 5-50
  formData.append("steps", "30"); // Default value between 30-500
  formData.append("strength", "0.7"); // Default value between 0-1

  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      authorization: `Bearer ${process.env.MONSTER_API_KEY}`,
    },
    body: formData,
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      `Monster API error: ${response.status} ${
        errorData ? JSON.stringify(errorData) : response.statusText
      }`
    );
  }

  const data = await response.json();

  // Check if we need to fetch results (async processing)
  if (data.process_id) {
    // Return the process ID for client-side polling
    return {
      status: "processing",
      process_id: data.process_id,
    };
  }

  return data;
}

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.MONSTER_API_KEY) {
      throw new Error("Monster API key not configured");
    }

    const { imageUrl, prompt } = await req.json();

    if (!imageUrl || !prompt) {
      return NextResponse.json(
        { error: "Image URL and prompt are required" },
        { status: 400 }
      );
    }

    const result = await generateImg2Img(imageUrl, prompt);

    return NextResponse.json(result);
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

// Add a new endpoint to fetch results
export async function GET(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get process_id from URL params
    const { searchParams } = new URL(req.url);
    const processId = searchParams.get("process_id");

    if (!processId) {
      return NextResponse.json(
        { error: "Process ID is required" },
        { status: 400 }
      );
    }

    // Fetch results from Monster API
    const response = await fetch(
      `https://api.monsterapi.ai/v1/status/${processId}`,
      {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${process.env.MONSTER_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch results: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
}
