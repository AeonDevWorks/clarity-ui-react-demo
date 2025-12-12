import { GoogleGenerativeAI } from "@google/generative-ai";
import { FetchedData } from "@/hooks/useUrlOrScreenshotInput";
import { ClarityMode } from "@/types";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_PROMPT = `
You are ClarityUI, an interface transformer.
Input types: screenshot, rendered HTML, or both.
Goal: Transform the input into a simplified, accessible, and structured UI based on the selected cognitive mode.

Modes:
- Zen: Minimalist, low-stimulus, single column.
- Flow: Step-by-step sequential tasks (3-5 steps max).
- ADHD: Single focus element, high contrast key actions.

Output:
Return a JSON object describing the "Dynamic View" components.
Do not invent facts. Use the source content.
Structure:
{
  "layout": "single-column" | "two-column" | "stepper",
  "components": [
    { "type": "header", "content": "..." },
    { "type": "card", "title": "...", "body": "..." },
    { "type": "action", "label": "...", "actionToken": "..." }
  ]
}
`;

export async function generateClarityView(
    data: FetchedData, 
    mode: ClarityMode, 
    history: string[] = []
) {
    if (!apiKey) {
        console.warn("Gemini API Key missing");
        return null;
    }

    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-pro-latest", // usage of 1.5 pro or flash
        systemInstruction: SYSTEM_PROMPT
    });

    const parts: any[] = [];
    
    // Add text context
    parts.push(`Cognitive Mode: ${mode}`);
    if (data.title) parts.push(`Page Title: ${data.title}`);
    if (data.renderedHtml) parts.push(`HTML Content: ${data.renderedHtml.substring(0, 20000)}...`); // Truncate to safe limit if needed

    // Add image
    if (data.screenshotBase64) {
        // Strip prefix if present
        const base64Data = data.screenshotBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
        parts.push({
            inlineData: {
                data: base64Data,
                mimeType: "image/jpeg"
            }
        });
    }

    try {
        const result = await model.generateContent(parts);
        const response = result.response;
        return response.text();
    } catch (e) {
        console.error("Gemini generation error:", e);
        throw e;
    }
}
