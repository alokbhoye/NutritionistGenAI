import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  try {
    const result = await ai.models.generateContent({
      model: "models/gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: "Explain how AI works in a few words" }] }],
    });

    // ✅ Print full response for debugging
    console.log("🔄 Raw Gemini response:\n", JSON.stringify(result, null, 2));

    // ✅ Correct way to extract the text
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      console.log("\n✅ Gemini Output:\n", text.trim());
    } else {
      console.warn("⚠️ No text content found in Gemini response.");
    }

  } catch (err) {
    console.error("❌ Gemini API Error:", err.message);
  }
}

main();
