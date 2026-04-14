import { useTransition } from "react";
import { updateReceiptAction, Receipt } from "@/app/actions/receipts";
import { Pencil, X } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface EditModalProps {
  receipt: Receipt;
  onClose: () => void;
}

export default function EditModal({ receipt, onClose }: EditModalProps) {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleUpdate = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updateReceiptAction(receipt.id, formData);
      if (result.success) {
        showToast("Data transaksi berhasil diperbarui", "success");
        onClose();
      } else {
        showToast("Gagal memperbarui: " + result.error, "error");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md p-6 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-3xl -mr-16 -mt-16 rounded-full"></div>
        
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600">
              <Pencil className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Transaksi</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form action={handleUpdate} className="space-y-5 relative z-10">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Nama Toko/Restoran</label>
            <input
              name="merchant"
              type="text"
              defaultValue={receipt.merchant}
              required
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 shadow-xs transition-all outline-hidden"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Keperluan</label>
            <input
              name="name"
              type="text"
              defaultValue={receipt.name}
              required
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 shadow-xs transition-all outline-hidden"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Kategori</label>
            <select
              name="category"
              defaultValue={receipt.category}
              required
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 shadow-xs transition-all outline-hidden cursor-pointer"
            >
              {[
                "Makanan & Minuman", 
                "Belanja", 
                "Transportasi", 
                "Hiburan", 
                "Kesehatan", 
                "Tagihan", 
                "Pendidikan", 
                "Lainnya"
              ].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Total Biaya</label>
              <input
                name="amount"
                type="number"
                defaultValue={receipt.amount}
                required
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-white font-bold text-primary-600 focus:ring-2 focus:ring-primary-500 shadow-xs transition-all outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Tanggal</label>
              <input
                name="date"
                type="date"
                defaultValue={receipt.date}
                required
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 shadow-xs transition-all outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Catatan (Optional)</label>
            <textarea
              name="note"
              defaultValue={receipt.note}
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 shadow-xs transition-all outline-hidden h-20 resize-none"
              placeholder="Tambahkan catatan khusus..."
            ></textarea>
          </div>
          
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-[10px] font-bold text-slate-400 hover:text-slate-600 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all uppercase tracking-widest"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-[10px] px-6 py-3 rounded-xl shadow-lg shadow-primary-500/20 disabled:opacity-50 transition-all uppercase tracking-widest"
            >
              {isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
