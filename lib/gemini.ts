import { GoogleGenerativeAI } from "@google/generative-ai";

// Mengambil semua API Key yang dipisahkan koma (misal: KEY1,KEY2)
const keys = (process.env.GEMINI_API_KEY || "").split(",").map(k => k.trim()).filter(k => k);

// Daftar model yang akan dicoba (urutan prioritas)
const MODELS_TO_TRY = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-flash-latest"];

export interface GeminiModelAttempt {
  model: any;
  modelName: string;
  keyIndex: number;
  keySuffix: string;
}

export async function getGeminiModelWithRotation(): Promise<GeminiModelAttempt[]> {
  const keysCount = keys.length;
  console.log(`[Gemini SDK] Mendeteksi total ${keysCount} API Key`);

  if (keysCount === 0) throw new Error("GEMINI_API_KEY tidak ditemukan di .env.local");
  
  const attempts: GeminiModelAttempt[] = [];

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const genAI = new GoogleGenerativeAI(key);
    const keySuffix = key.slice(-4);

    for (const modelName of MODELS_TO_TRY) {
      attempts.push({
        model: genAI.getGenerativeModel({ model: modelName }),
        modelName,
        keyIndex: i + 1,
        keySuffix
      });
    }
  }

  return attempts;
}
