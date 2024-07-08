import type { GenerativeContentBlob } from "@google/generative-ai";

export const unauthorized = () => new Response("Unauthorized", { status: 401 });

export async function urlToInlineData(
  url: string,
): Promise<GenerativeContentBlob> {
  // Fetch the content from the URL
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch image URL: ${response.statusText}`);
  }

  // Read the response as a blob
  const blob = await response.blob();

  // Extract the MIME type from the response headers
  const mimeType = response.headers.get("Content-Type") ?? blob.type;

  // Convert the blob to a base64 string
  const base64Data = await blobToBase64(blob);

  // Return the MIME type and the base64 string
  return {
    mimeType,
    data: base64Data,
  };
}

// Helper function to convert a Blob to a base64 string
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result;
      if (typeof base64data === "string") {
        resolve(base64data.split(",")[1]);
      } else {
        reject(new Error("Failed to convert Blob to base64 string"));
      }
    };
    reader.onerror = () => {
      reject(new Error("Failed to read Blob"));
    };
    reader.readAsDataURL(blob);
  });
}
