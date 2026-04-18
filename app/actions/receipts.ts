"use server";

import { getDriveClient } from "@/lib/google-drive";
import { revalidatePath } from "next/cache";
import { Readable } from "stream";
import { getGeminiModelWithRotation } from "@/lib/gemini";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface Receipt {
  id: string;
  fileId: string;
  name: string; // Keperluan
  merchant: string; // Nama Toko
  amount: number;
  date: string;
  category: string;
  note?: string; // Catatan opsional
}

const GEN_AI_PROMPT = `Analisis gambar struk ini dan ekstrak informasi berikut dalam format JSON:
{
  "name": "nama keperluan transaksi singkat (misal: Makan Siang, Belanja Bulanan, Transport)",
  "merchant": "Nama toko atau restoran (misal: Indomaret, McDonald's, Starbucks)",
  "amount": angka total biaya saja (jangan ada Rp atau titik/koma),
  "date": "tanggal transaksi format YYYY-MM-DD",
  "category": "Pilih satu: Makanan & Minuman, Belanja, Transportasi, Hiburan, Kesehatan, Tagihan, Pendidikan, Lainnya"
}
Jika informasi tidak ditemukan, berikan nilai kosong atau 0 untuk angka.`;

const DATABASE_FILE_NAME = "database.json";

async function findOrCreateDatabaseFile(drive: any) {
  const response = await drive.files.list({
    q: `name = '${DATABASE_FILE_NAME}' and trashed = false`,
    fields: "files(id, name)",
  });

  if (response.data.files && response.data.files.length > 0) {
    return response.data.files[0].id;
  }

  // Create empty database.json
  const fileMetadata = {
    name: DATABASE_FILE_NAME,
    mimeType: "application/json",
  };
  const media = {
    mimeType: "application/json",
    body: JSON.stringify([]),
  };

  const file: any = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: "id",
  });

  return file.data.id;
}

export async function analyzeReceiptAction(formData: FormData) {
  try {
    console.log("[Server Action] analyzeReceiptAction started");
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file selected");
    console.log(`[Server Action] File: ${file.name}, Type: ${file.type}, Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = buffer.toString("base64");

    const attempts = await getGeminiModelWithRotation();
    let lastError = null;

    // Coba setiap Kombinasi Key & Model yang tersedia (Rotasi + Fallback)
    for (let i = 0; i < attempts.length; i++) {
      const { model, modelName, keyIndex, keySuffix } = attempts[i];
      try {
        console.log(`[Gemini SDK] 🚀 Mencoba Attempt ke-${i + 1}: Key #${keyIndex} (...${keySuffix}) menggunakan ${modelName}`);
        
        const result = await model.generateContent([
          GEN_AI_PROMPT,
          {
            inlineData: {
              data: base64Image,
              mimeType: file.type,
            },
          },
        ]);

        const response = await result.response;
        const text = response.text();
        
        // Clean JSON from text (sometimes Gemini adds ```json ... ```)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Failed to parse AI response");
        
        const data = JSON.parse(jsonMatch[0]);
        console.log(`[Gemini SDK] ✅ Berhasil menggunakan ${modelName} (Key #${keyIndex})`);
        return { success: true, data };
      } catch (error: any) {
        lastError = error;
        const status = error.status || "UNKNOWN";
        console.warn(`[Gemini SDK] ❌ Attempt ke-${i + 1} Gagal (${modelName}):`, error.message);
        
        // Jika masih ada attempt lain, lanjut ke iterasi berikutnya
        if (i < attempts.length - 1) {
          console.log(`[Gemini SDK] 🔄 Mencoba fallback berikutnya...`);
          continue;
        }
      }
    }

    throw lastError || new Error("Semua API Key gagal memproses gambar.");
  } catch (error) {
    console.error("AI Analysis error:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getReceiptData(): Promise<Receipt[]> {
  try {
    const drive = await getDriveClient();
    const fileId = await findOrCreateDatabaseFile(drive);

    const response = await drive.files.get({
      fileId: fileId,
      alt: "media",
    });

    return (response.data as Receipt[]) || [];
  } catch (error) {
    console.error("Error reading database.json:", error);
    return [];
  }
}

export async function uploadReceipt(formData: FormData) {
  try {
    console.log("[Server Action] uploadReceipt started");
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    const merchant = formData.get("merchant") as string;
    const amount = Number(formData.get("amount"));
    const date = formData.get("date") as string;
    const category = formData.get("category") as string;
    const note = formData.get("note") as string;

    console.log(`[Server Action] Uploading metadata for: ${name} dari ${merchant}`);
    if (file) {
      console.log(`[Server Action] File to upload: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    }

    if (!file) throw new Error("No file selected");

    const drive = await getDriveClient();
    
    // 1. Upload the image file
    const uploadResult = await drive.files.create({
      requestBody: {
        name: `${Date.now()}-${file.name}`,
        parents: [], // Root of drive
      },
      media: {
        mimeType: file.type,
        body: Readable.from(Buffer.from(await file.arrayBuffer())),
      },
    });

    const fileId = uploadResult.data.id!;

    // 2. Add metadata to database.json
    const dbFileId = await findOrCreateDatabaseFile(drive);
    const currentData = await getReceiptData();
    
    const newReceipt: Receipt = {
      id: crypto.randomUUID(),
      fileId,
      name,
      merchant,
      amount,
      date,
      category,
      note,
    };

    const updatedData = [...currentData, newReceipt];

    await drive.files.update({
      fileId: dbFileId,
      media: {
        mimeType: "application/json",
        body: JSON.stringify(updatedData),
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error uploading receipt:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function updateReceiptAction(id: string, formData: FormData) {
  try {
    const drive = await getDriveClient();
    const name = formData.get("name") as string;
    const merchant = formData.get("merchant") as string;
    const amount = Number(formData.get("amount"));
    const date = formData.get("date") as string;
    const category = formData.get("category") as string;
    const note = formData.get("note") as string;

    const dbFileId = await findOrCreateDatabaseFile(drive);
    const currentData = await getReceiptData();

    const updatedData = currentData.map((receipt) => {
      if (receipt.id === id) {
        return { ...receipt, name, merchant, amount, date, category, note };
      }
      return receipt;
    });

    await drive.files.update({
      fileId: dbFileId,
      media: {
        mimeType: "application/json",
        body: JSON.stringify(updatedData),
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating receipt:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function logoutAction() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  session.destroy();
  redirect("/");
}

export async function deleteReceiptAction(id: string, fileId: string) {
  try {
    const drive = await getDriveClient();
    
    // 1. Delete the image file from Drive
    await drive.files.delete({ fileId });

    // 2. Remove from database.json
    const dbFileId = await findOrCreateDatabaseFile(drive);
    const currentData = await getReceiptData();
    const updatedData = currentData.filter((receipt) => receipt.id !== id);

    await drive.files.update({
      fileId: dbFileId,
      media: {
        mimeType: "application/json",
        body: JSON.stringify(updatedData),
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting receipt:", error);
    return { success: false, error: (error as Error).message };
  }
}
