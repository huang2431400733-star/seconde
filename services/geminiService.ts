import { GoogleGenAI, Type } from "@google/genai";
import { QuoteData } from '../types';

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API_KEY is missing");
        return null;
    }
    return new GoogleGenAI({ apiKey });
};

// 论坛发帖辅助
export const generatePostContent = async (topic: string): Promise<{ title: string; content: string }> => {
  const ai = getClient();
  if (!ai) throw new Error("Gemini Client not initialized");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `写一个简短、吸引人的论坛帖子，关于主题："${topic}"。
      请以JSON格式返回，严格包含两个字段："title" (一个吸引人的标题) 和 "content" (正文内容，约100字，中文)。
      不要包含markdown格式如 \`\`\`json。`,
    });
    
    const text = response.text?.trim() || "{}";
    const jsonStr = text.replace(/^```json/, '').replace(/```$/, '');
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error generating post:", error);
    throw error;
  }
};

// 每日名言生成 (ZenSpace)
export const generateInspirationalQuote = async (): Promise<QuoteData> => {
  const ai = getClient();
  if (!ai) {
    return {
      text: "预测未来的最好方法就是去创造它。",
      author: "彼得·德鲁克"
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "生成一句简短、独特且鼓舞人心的名言（中文）。以JSON对象返回，包含 'text' 和 'author' 字段。",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            author: { type: Type.STRING }
          },
          required: ["text", "author"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as QuoteData;

  } catch (error) {
    console.error("Failed to generate quote:", error);
    return {
      text: "相信你能做到，你就已经成功了一半。",
      author: "西奥多·罗斯福"
    };
  }
};

// 待办事项建议 (ZenSpace)
export const generateTodoSuggestion = async (currentTasks: string[]): Promise<string> => {
    const ai = getClient();
    if (!ai) return "深呼吸，放松一下";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `基于这些任务：${JSON.stringify(currentTasks)}，建议下一个单一的、可执行的简短任务（中文）。如果为空，建议一个通用的生产力任务。保持在10个字以内。`,
        });
        return response.text?.trim() || "整理你的工作区";
    } catch (error) {
        return "喝一杯水";
    }
}
