import { useState, useTransition } from "react";
import { uploadReceipt, analyzeReceiptAction } from "@/app/actions/receipts";
import { Sparkles, Image as ImageIcon, RefreshCw, X, Info, Gauge } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { compressImage } from "@/lib/image-compression";

export default function UploadForm() {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isCompressing, setIsCompressing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [detectedData, setDetectedData] = useState({ name: "", merchant: "", amount: 0, date: "", category: "Lainnya", note: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileInfo, setFileInfo] = useState<{ originalSize: number; compressedSize: number } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const originalSize = file.size;
      
      setIsCompressing(true);
      try {
        const compressedFile = await compressImage(file);
        setSelectedFile(compressedFile);
        setFileInfo({ 
          originalSize, 
          compressedSize: compressedFile.size 
        });
        if (originalSize > compressedFile.size) {
          showToast(`Gambar dikompres: ${(originalSize / 1024 / 1024).toFixed(1)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(1)}MB`, "success");
        }
      } catch (error) {
        console.error("Compression error:", error);
        setSelectedFile(file); // Fallback ke original jika gagal
        showToast("Gagal mengompres gambar, menggunakan file asli", "info");
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleScanAI = async () => {
    if (!selectedFile) return;
    setIsScanning(true);
    
    const formData = new FormData();
    formData.append("file", selectedFile);

    const result = await analyzeReceiptAction(formData);
    setIsScanning(false);

    if (result.success && result.data) {
      setDetectedData(result.data);
      setShowConfirmation(true);
      showToast("Data struk berhasil dideteksi AI", "success");
    } else {
      showToast("AI Gagal menganalisis: " + result.error, "error");
    }
  };

  const handleFinalSubmit = async (formData: FormData) => {
    if (!selectedFile) return;
    
    // Append the file since it's not in the confirmation form directly as an input
    formData.append("file", selectedFile);

    startTransition(async () => {
      const result = await uploadReceipt(formData);
      if (result.success) {
        showToast("Berhasil disimpan ke Google Drive!", "success");
        resetForm();
      } else {
        showToast("Gagal menyimpan: " + result.error, "error");
      }
    });
  };

  const resetForm = () => {
    setShowConfirmation(false);
    setSelectedFile(null);
    setDetectedData({ name: "", merchant: "", amount: 0, date: "", category: "Lainnya", note: "" });
    const form = document.getElementById("receipt-form") as HTMLFormElement;
    if (form) form.reset();
  };

  if (showConfirmation) {
    return (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border-2 border-primary-500 animate-in fade-in zoom-in duration-300">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-primary-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Konfirmasi AI</h2>
        </div>
        
        <p className="text-[11px] text-slate-500 mb-6 leading-relaxed">
          Sistem kami telah mengekstrak detail struk secara otomatis. Silakan tinjau kembali data di bawah ini.
        </p>

        <form action={handleFinalSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Nama Toko/Restoran</label>
            <input
              name="merchant"
              type="text"
              defaultValue={detectedData.merchant}
              placeholder="Misal: Indomaret, McDonald's"
              required
              className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 shadow-xs transition-all outline-hidden"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Keperluan</label>
            <input
              name="name"
              type="text"
              defaultValue={detectedData.name}
              placeholder="Misal: Makan Siang, Belanja Bulanan"
              required
              className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 shadow-xs transition-all outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Kategori</label>
            <select
              name="category"
              defaultValue={detectedData.category}
              required
              className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 shadow-xs transition-all outline-hidden cursor-pointer"
            >
              {["Makanan & Minuman", "Belanja", "Transportasi", "Hiburan", "Kesehatan", "Tagihan", "Pendidikan", "Lainnya"].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Total</label>
              <input
                name="amount"
                type="number"
                defaultValue={detectedData.amount}
                required
                className="w-full px-4 py-2 text-sm rounded-xl border dark:bg-slate-800 dark:border-slate-700 font-bold text-primary-600 focus:ring-2 focus:ring-primary-500 outline-hidden transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Tanggal</label>
              <input
                name="date"
                type="date"
                defaultValue={detectedData.date}
                required
                className="w-full px-4 py-2 text-sm rounded-xl border dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-hidden transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Catatan (Opsional)</label>
            <textarea
              name="note"
              defaultValue={detectedData.note}
              placeholder="Tambahkan keterangan tambahan jika perlu..."
              className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 shadow-xs transition-all outline-hidden resize-none h-20"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowConfirmation(false)}
              className="flex-1 px-4 py-2 text-xs font-bold text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all uppercase tracking-widest"
            >
              Kembali
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-2 btn-primary bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 rounded-xl shadow-lg shadow-primary-500/20 disabled:opacity-50 transition-all uppercase text-[10px] tracking-widest"
            >
              {isPending ? "Menyimpan..." : "Simpan Data"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <ImageIcon className="w-5 h-5 text-slate-400" />
        Tambah Struk
      </h2>
      <div id="receipt-form" className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Pilih File Gambar</label>
          <input
            id="file-upload"
            name="file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <label 
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-36 px-4 py-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all group"
          >
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-3 group-hover:scale-110 transition-transform">
               <ImageIcon className="w-8 h-8 text-slate-300 group-hover:text-primary-500 transition-colors" />
            </div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-tight">Klik untuk upload</span>
          </label>
        </div>

        {/* Tip Note */}
        <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
            <span className="font-bold">Tips:</span> Pastikan foto struk tidak blur, tidak terpotong, dan teks terlihat jelas agar AI dapat menganalisis dengan akurat.
          </p>
        </div>

        {selectedFile && (
          <div className="flex flex-col gap-3 animate-in slide-in-from-top-2 duration-300 mt-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex flex-col gap-0.5 overflow-hidden">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary-500 shrink-0" />
                  <span className="text-xs truncate font-medium text-slate-600 dark:text-slate-300">{selectedFile.name}</span>
                </div>
                {fileInfo && (
                  <div className="flex items-center gap-1.5 ml-6">
                    <Gauge className="w-3 h-3 text-emerald-500" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                      {(fileInfo.compressedSize / 1024 / 1024).toFixed(2)} MB 
                      {fileInfo.originalSize > fileInfo.compressedSize && (
                        <span className="text-emerald-500 ml-1">
                          (Saved {Math.round((1 - fileInfo.compressedSize / fileInfo.originalSize) * 100)}%)
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>
              <button 
                onClick={() => { setSelectedFile(null); setFileInfo(null); }} 
                className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                disabled={isCompressing || isScanning || isPending}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isCompressing && (
              <div className="flex items-center justify-center gap-2 py-2 bg-primary-50 dark:bg-primary-900/10 rounded-xl border border-primary-100 dark:border-primary-900/20">
                <RefreshCw className="w-3 h-3 text-primary-500 animate-spin" />
                <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">Mengompres Gambar...</span>
              </div>
            )}
            
            <button
              type="button"
              onClick={handleScanAI}
              disabled={isScanning}
              className="w-full py-3 bg-linear-to-r from-primary-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 overflow-hidden relative group"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-xs uppercase tracking-widest">Menganalisis...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span className="text-xs uppercase tracking-widest">Scan dengan AI</span>
                </>
              )}
              {isScanning && (
                <div className="absolute inset-0 bg-white/10 animate-pulse" />
              )}
            </button>
            
            <button
              onClick={() => {
                setDetectedData({ name: "", merchant: "", amount: 0, date: "", category: "Lainnya", note: "" });
                setShowConfirmation(true);
              }}
              className="w-full py-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-primary-600 transition-colors"
            >
              Input Manual
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
