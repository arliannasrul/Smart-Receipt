import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const API_KEY = process.env.GEMINI_API_KEY;

async function checkModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
  
  try {
    console.log("Memeriksa daftar model yang tersedia...");
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.models) {
      console.log("Model yang tersedia untuk API Key Anda:");
      data.models.forEach(m => {
        console.log(`- ${m.name.replace('models/', '')} [${m.displayName}]`);
      });
    } else {
      console.error("Gagal mendapatkan daftar model:", data);
    }
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  }
}

checkModels();
