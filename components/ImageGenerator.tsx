async function handleImageGeneration(imageUrl: string, prompt: string) {
  try {
    // Initial request to start generation
    const response = await fetch("/api/img-img", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageUrl,
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate image");
    }

    const data = await response.json();

    // If we got a process_id, we need to poll for results
    if (data.status === "processing" && data.process_id) {
      return await pollForResults(data.process_id);
    }

    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function pollForResults(processId: string, maxAttempts = 30) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fetch(`/api/img-img?process_id=${processId}`);
    const data = await response.json();

    if (data.status === "completed") {
      return data;
    } else if (data.status === "failed") {
      throw new Error("Image generation failed");
    }

    // Wait 2 seconds before next attempt
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error("Timeout waiting for image generation");
}
