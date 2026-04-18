/**
 * Utility untuk mengompres gambar di sisi klien sebelum diunggah ke server.
 * Ini membantu menghindari batas payload Vercel (4.5MB) dan mempercepat proses AI.
 */

export async function compressImage(file: File, maxMB: number = 2): Promise<File> {
  // Jika file sudah kecil, tidak perlu dikompres
  if (file.size <= maxMB * 1024 * 1024) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Batasi dimensi maksimum (misal 2000px) agar proses AI tidak terlalu berat
        const MAX_SIZE = 2000;
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return reject(new Error("Gagal mendapatkan context canvas"));
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Mulai dengan kualitas 0.8
        let quality = 0.8;
        
        const convertToBlob = (q: number): Promise<Blob | null> => {
          return new Promise((res) => {
            canvas.toBlob((blob) => res(blob), "image/jpeg", q);
          });
        };

        const attemptCompression = async (q: number): Promise<File> => {
          const blob = await convertToBlob(q);
          if (!blob) throw new Error("Gagal mengonversi canvas ke blob");

          // Jika ukuran masih terlalu besar dan kualitas masih bisa diturunkan
          if (blob.size > maxMB * 1024 * 1024 && q > 0.1) {
            return attemptCompression(q - 0.1);
          }

          return new File([blob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
        };

        attemptCompression(quality)
          .then(resolve)
          .catch(reject);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
