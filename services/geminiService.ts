import { GoogleGenAI, Chat, FunctionDeclaration, Type, FunctionResponsePart } from '@google/genai';
import type { Source } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getCurrentTimeFunction: FunctionDeclaration = {
  name: 'getCurrentTime',
  description: 'Get the current time in a specific timezone.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      timezone: {
        type: Type.STRING,
        description: 'The timezone to get the current time for, e.g., "America/New_York". If not provided, UTC will be used.',
      },
    },
    required: [],
  },
};

export function startChat(): Chat {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'You are Hamza, a helpful and friendly AI assistant. You have access to Google Search for real-time information and a tool to get the current time.',
      tools: [
        { googleSearch: {} },
        { functionDeclarations: [getCurrentTimeFunction] }
      ],
    },
  });
}

export interface AiResponse {
  text: string;
  sources?: Source[];
}

export async function sendMessageToAI(chat: Chat, message: string): Promise<AiResponse> {
  try {
    let response = await chat.sendMessage({ message });

    if (response.functionCalls && response.functionCalls.length > 0) {
      // FIX: The array was incorrectly typed as `FunctionResponsePart[]`. An array of `Part` objects is expected.
      // Removing the type annotation allows TypeScript to correctly infer the type of the pushed elements.
      const functionResponseParts = [];

      for (const funcCall of response.functionCalls) {
        if (funcCall.name === 'getCurrentTime') {
          const { timezone } = funcCall.args;
          const now = new Date();
          let timeString = '';
          try {
            timeString = now.toLocaleTimeString('en-US', { timeZone: (timezone as string) || 'UTC', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' });
          } catch (e) {
            timeString = `Invalid timezone provided. Using UTC: ${now.toLocaleTimeString('en-US', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' })}`;
          }
          
          functionResponseParts.push({
            functionResponse: {
              name: funcCall.name,
              response: { result: `The current time is ${timeString}` },
            },
          });
        }
      }

      if (functionResponseParts.length > 0) {
        // FIX: The `chat.sendMessage` method expects a `message` property with a `Content` object, not `contents`.
        response = await chat.sendMessage({ message: { parts: functionResponseParts } });
      }
    }
    
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks
      ?.map(chunk => chunk.web)
      .filter((web): web is { title: string; uri: string } => !!(web?.uri && web?.title)) || [];

    return {
      text: response.text,
      sources: sources.length > 0 ? sources : undefined,
    };

  } catch (error) {
    console.error("Error sending message to Gemini API:", error);
    throw new Error("Failed to get a response from the AI. Please check your API key and network connection.");
  }
}
