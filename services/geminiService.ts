import { GoogleGenAI } from "@google/genai";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API_KEY is missing");
        return null;
    }
    return new GoogleGenAI({ apiKey });
};

export const generatePostContent = async (topic: string): Promise<{ title: string; content: string }> => {
  const ai = getClient();
  if (!ai) throw new Error("Gemini Client not initialized");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Write a short, engaging forum post about: "${topic}". 
      Return the response in JSON format with strictly two keys: "title" (a catchy title) and "content" (the body text, around 100 words).
      Do not include markdown formatting like \`\`\`json.`,
    });
    
    const text = response.text?.trim() || "{}";
    // Simple cleanup if the model wraps in markdown
    const jsonStr = text.replace(/^```json/, '').replace(/```$/, '');
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error generating post:", error);
    throw error;
  }
};