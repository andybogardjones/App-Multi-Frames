
import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
import { Suggestion, ChatMessage } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
let chatInstance: Chat | null = null;

export async function generateImage(prompt: string, aspectRatio: string): Promise<string> {
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;
    }
    throw new Error("No image was generated.");
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image. Please check the console for details.");
  }
}

export async function fetchSuggestions(currentScenePrompt: string): Promise<Suggestion[]> {
  try {
    const prompt = `
    The current storyboard scene is: "${currentScenePrompt}".
    Based on this, provide 3 creative and distinct suggestions for the next scene.
    Each suggestion should be a concise, descriptive prompt suitable for an image generation model.
    Categorize your suggestions into: "Camera Shot", "Action/Movement", and "Detail Focus".
    Provide exactly one suggestion per category.
    `;

    const response = await ai.models.generateContent({
       model: "gemini-2.5-flash",
       contents: prompt,
       config: {
         responseMimeType: "application/json",
         responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: {
                  type: Type.STRING,
                  description: 'The category of the suggestion (e.g., "Camera Shot").',
                },
                prompt: {
                  type: Type.STRING,
                  description: 'The descriptive prompt for the next scene.',
                },
              },
              required: ["category", "prompt"],
            },
          },
       },
    });

    const jsonString = response.text.trim();
    const suggestions = JSON.parse(jsonString);
    return suggestions as Suggestion[];

  } catch (error) {
    console.error("Error fetching suggestions:", error);
    throw new Error("Failed to fetch suggestions. Please try again.");
  }
}

function initializeChat() {
    if (!chatInstance) {
        chatInstance = ai.chats.create({
            model: 'gemini-2.5-flash',
        });
    }
}

export async function* streamChatResponse(history: ChatMessage[], newMessage: string): AsyncGenerator<string> {
    initializeChat();

    // Re-initialize chat with history if needed. This is a simplified approach.
    // For a real app, you might want a more sophisticated history management.
    if(chatInstance) {
        chatInstance.history = history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }));
    } else {
        throw new Error("Chat not initialized");
    }

    try {
        const responseStream = await chatInstance.sendMessageStream({ message: newMessage });
        for await (const chunk of responseStream) {
            yield chunk.text;
        }
    } catch (error) {
        console.error("Error in chat stream:", error);
        yield "Sorry, I encountered an error. Please try again.";
    }
}
