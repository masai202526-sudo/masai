import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available from environment variables
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const handleError = (error: unknown, context: string): string => {
    console.error(`Error in ${context}:`, error);
    if (error instanceof Error) {
         return `An error occurred while communicating with the API: ${error.message}`;
    }
    return `An unknown error occurred during ${context}.`;
}

export async function generateContent(prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const text = response.text;
        if (text) {
            return text;
        } else {
            throw new Error("No text content found in the response.");
        }
    } catch (error) {
       return handleError(error, "text generation");
    }
}

export async function generateImage(prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
            },
        });

        const base64ImageBytes = response.generatedImages[0]?.image.imageBytes;
        if (base64ImageBytes) {
            return `data:image/png;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image data found in the response.");
        }
    } catch (error) {
        return handleError(error, "image generation");
    }
}

export async function generateVideo(prompt: string): Promise<string> {
    try {
        let operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: prompt,
            config: {
                numberOfVideos: 1,
            }
        });

        while (!operation.done) {
            // Poll every 10 seconds
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (downloadLink) {
            // The API key must be appended to the URI to access the video
            return `${downloadLink}&key=${process.env.API_KEY}`;
        } else {
            throw new Error("No video URI found in the completed operation.");
        }
    } catch (error) {
        return handleError(error, "video generation");
    }
}
