import { GoogleGenAI, Type } from "@google/genai";
import { RiskReport, DamageAnalysis, DisasterStat } from "../types";

// Initialize Gemini Client
// IMPORTANT: Accessing process.env.API_KEY directly as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instructions for the chatbot
const CHAT_SYSTEM_INSTRUCTION = `
You are Cegah.AI, a specialized disaster preparedness assistant for Indonesia.
Saya dibuat oleh Kak Riski Pratama.
Your goal is to provide accurate, calm, and actionable advice regarding natural disasters (floods, earthquakes, landslides, tsunamis, volcanic eruptions).
- Always prioritize human safety.
- Use Indonesian language (Bahasa Indonesia) by default, but adapt if the user speaks English.
- Reference Indonesian authorities like BMKG or BNPB when relevant (generically).
- Keep answers concise and easy to read on mobile devices.
- If a user reports an immediate life-threatening emergency, advise them to contact local authorities (112 or Basarnas) immediately.
`;

export const sendMessageToGemini = async (message: string, history: {role: string, parts: {text: string}[]}[] = []): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: CHAT_SYSTEM_INSTRUCTION,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message });
    return result.text || "Maaf, saya tidak dapat memproses permintaan Anda saat ini.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Terjadi kesalahan koneksi. Silakan coba lagi.";
  }
};

export const analyzeDamageImage = async (base64Image: string): Promise<DamageAnalysis | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: `Analyze this image for disaster damage in an Indonesian context. 
            Identify if there is visible damage (flood, earthquake debris, landslide, fire).
            Return a JSON object with:
            - severity: "Minor", "Moderate", or "Severe"
            - damageType: Short description of the damage (e.g., "Banjir setinggi lutut", "Retakan dinding akibat gempa")
            - immediateActions: Array of 3 short, imperative strings for safety steps in Bahasa Indonesia.
            - safetyCheck: One short sentence assessing if the area looks safe to stay.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            severity: { type: Type.STRING, enum: ["Minor", "Moderate", "Severe"] },
            damageType: { type: Type.STRING },
            immediateActions: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            safetyCheck: { type: Type.STRING }
          },
          required: ["severity", "damageType", "immediateActions", "safetyCheck"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return null;
    return JSON.parse(jsonText) as DamageAnalysis;
  } catch (error) {
    console.error("Damage Analysis Error:", error);
    throw error;
  }
};

export const analyzeLocationRisk = async (lat: number, lon: number): Promise<RiskReport | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the potential natural disaster risks for the coordinate location: Latitude ${lat}, Longitude ${lon} (in Indonesia).
      Consider historical data for floods, earthquakes, and landslides in this region.
      Return a JSON object with:
      - locationName: Approximate city/regency name.
      - riskLevel: "Low", "Medium", "High", or "Critical"
      - hazards: Array of strings (e.g., "Gempa Bumi", "Banjir Tahunan")
      - recommendations: Array of 3 specific preparedness tips for this location in Bahasa Indonesia.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                locationName: { type: Type.STRING },
                riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
                hazards: { type: Type.ARRAY, items: { type: Type.STRING } },
                recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["locationName", "riskLevel", "hazards", "recommendations"]
        }
      }
    });
    
    const jsonText = response.text;
    if (!jsonText) return null;
    return JSON.parse(jsonText) as RiskReport;
  } catch (error) {
    console.error("Location Risk Error:", error);
    throw error;
  }
};

export const getDisasterStats = async (): Promise<DisasterStat[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a statistical estimation of natural disaster occurrences in Indonesia for the year 2025 based on current meteorological trends (e.g., La Nina/El Nino impact) and geological activity.
      Focus on these 4 categories: 'Banjir' (Floods), 'Longsor' (Landslides), 'Gempa' (Earthquakes), 'Lainnya' (Others: Puting Beliung, Kebakaran, etc).
      Return a JSON array where each object has:
      - name: string (Category name in Indonesia)
      - count: number (Estimated percentage share of total incidents, e.g. 45 for 45%)
      - color: string (Strictly use: Banjir='#3b82f6', Longsor='#eab308', Gempa='#ef4444', Lainnya='#94a3b8')
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              count: { type: Type.NUMBER },
              color: { type: Type.STRING }
            },
            required: ["name", "count", "color"]
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    return JSON.parse(jsonText) as DisasterStat[];
  } catch (error) {
    console.error("Stats Error:", error);
    return [];
  }
};
