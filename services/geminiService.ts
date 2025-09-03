import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

/**
 * Generates a conversational response based on chat history.
 * @param history The current list of chat messages.
 * @returns A promise that resolves to the AI's text response.
 */
export const getConverseResponse = async (history: ChatMessage[]): Promise<string> => {
  const chat = ai.chats.create({
    model: model,
    config: {
      systemInstruction: 'You are KAI, a helpful and friendly personal AI assistant. Keep your responses concise and conversational unless asked for detail.',
    },
    // Convert our app's ChatMessage format to the Gemini API's format
    history: history.slice(0, -1) // Exclude the latest user message which will be sent next
      .filter(msg => msg.sender !== 'system') // Filter out system messages
      .map(msg => ({
        role: msg.sender === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      })),
  });

  const lastUserMessage = history[history.length - 1];
  if (lastUserMessage?.sender !== 'user') {
    throw new Error("Last message must be from the user to generate a response.");
  }
  
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message: lastUserMessage.text });
    return response.text;
  } catch (error) {
    console.error("Error in getConverseResponse:", error);
    return "I'm sorry, I encountered an error. Please try again.";
  }
};

/**
 * Generates creative text based on a user's prompt.
 * @param prompt The user's creative request.
 * @returns A promise that resolves to the generated creative text.
 */
export const getCreativeResponse = async (prompt: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        // FIX: The 'contents' field for a single text prompt should be a string, not an array of Content objects.
        contents: prompt,
        config: {
            systemInstruction: 'You are a master storyteller and creative writer. Fulfill the user\'s creative request with flair, imagination, and excellence.',
            temperature: 0.8,
        },
    });
    return response.text;
  } catch (error) {
    console.error("Error in getCreativeResponse:", error);
    return "I'm sorry, I couldn't generate a creative response at this moment.";
  }
};

/**
 * Analyzes a given text based on a user's question.
 * @param textToAnalyze The text to be analyzed.
 * @param question The user's question about the text.
 * @returns A promise that resolves to the AI's analysis.
 */
export const getAnalysisResponse = async (textToAnalyze: string, question: string): Promise<string> => {
  const prompt = `
    Please analyze the following text and answer the user's question.
    
    --- TEXT TO ANALYZE ---
    ${textToAnalyze}
    --- END OF TEXT ---

    --- USER'S QUESTION ---
    ${question}
    --- END OF QUESTION ---

    Provide a clear and concise analysis based *only* on the provided text.
  `;
  try {
     const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        // FIX: The 'contents' field for a single text prompt should be a string, not an array of Content objects.
        contents: prompt,
        config: {
            systemInstruction: 'You are a precise and insightful analyst. Your task is to carefully analyze the provided text and answer the user\'s question based on it.',
        },
    });
    return response.text;
  } catch (error) {
    console.error("Error in getAnalysisResponse:", error);
    return "I'm sorry, I was unable to complete the analysis.";
  }
};

/**
 * Creates a concise summary of a piece of text to be stored as a "memory".
 * @param textToSummarize The text to be summarized.
 * @returns A promise that resolves to a short summary string (max 15 words).
 */
export const createMemorySummary = async (textToSummarize: string): Promise<string> => {
    const prompt = `Summarize the key insight from the following text in 15 words or less. This summary will be used as a title for a memory.
    
    TEXT: "${textToSummarize}"
    
    SUMMARY:`;
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            // FIX: The 'contents' field for a single text prompt should be a string, not an array of Content objects.
            contents: prompt,
            config: {
                systemInstruction: 'You are an expert summarizer. Your goal is to create a very short, poignant title-like summary of a piece of text.',
                temperature: 0.2,
                stopSequences: ['\n']
            },
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error in createMemorySummary:", error);
        return "Key insight recorded.";
    }
};
