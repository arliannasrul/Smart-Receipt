"use client";

import { useState, useTransition } from "react";
import * as XLSX from "xlsx";
import { Receipt, logoutAction, deleteReceiptAction } from "@/app/actions/receipts";
import UploadForm from "@/components/UploadForm";
import EditModal from "@/components/EditModal";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  TrendingUp, 
  LogOut, 
  Pencil, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  User,
  ArrowUpDown,
  Filter,
  Download,
  FileSpreadsheet,
  CalendarDays,
  Database
} from "lucide-react";

interface DashboardClientProps {
  receipts: Receipt[];
  user?: {
    name?: string;
    picture?: string;
  };
}

export default function DashboardClient({ receipts, user }: DashboardClientProps) {
  const { showToast } = useToast();
  const [editingReceipt, setEditingReceipt] = useState<Receipt | null>(null);
  const [isDeleting, startDeletion] = useTransition();
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const handleDelete = async (id: string, fileId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus struk ini? File di Google Drive juga akan dihapus.")) return;

    startDeletion(async () => {
      const result = await deleteReceiptAction(id, fileId);
      if (result.success) {
        showToast("Transaksi berhasil dihapus", "success");
      } else {
        showToast("Gagal menghapus: " + result.error, "error");
      }
    });
  };

  // Extract unique months for filtering
  const availableMonths = Array.from(new Set(receipts.map(r => {
    const d = new Date(r.date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }))).sort().reverse();

  // Extract unique years for downloading
  const availableYears = Array.from(new Set(receipts.map(r => {
    return new Date(r.date).getFullYear();
  }))).sort((a, b) => b - a);

  const formatMonth = (yearMonth: string) => {
    const [year, month] = yearMonth.split("-");
    return new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(new Date(parseInt(year), parseInt(month) - 1));
  };

  const filteredReceipts = receipts.filter(r => {
    if (filterMonth === "all") return true;
    const d = new Date(r.date);
    const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    return m === filterMonth;
  });

  const sortedReceipts = [...filteredReceipts].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return b.amount - a.amount;
    }
  });

  const handleDownloadExcel = (scope: "filter" | "all" | number) => {
    let dataToExport = [];
    let filename = `Riwayat_Transaksi_${new Date().toISOString().split('T')[0]}.xlsx`;

    if (scope === "filter") {
      dataToExport = sortedReceipts;
      const monthLabel = filterMonth === "all" ? "Semua" : formatMonth(filterMonth);
      filename = `Transaksi_${monthLabel.replace(/\s+/g, '_')}.xlsx`;
    } else if (typeof scope === "number") {
      dataToExport = receipts.filter(r => new Date(r.date).getFullYear() === scope);
      filename = `Transaksi_Tahun_${scope}.xlsx`;
    } else {
      dataToExport = receipts;
      filename = `Riwayat_Transaksi_Lengkap.xlsx`;
    }

    if (dataToExport.length === 0) {
      showToast("Tidak ada data untuk diunduh", "info");
      return;
    }

    // Prepare data for Excel
    const worksheetData = dataToExport.map((r, index) => ({
      "No": index + 1,
      "Tanggal": r.date,
      "Keperluan": r.name,
      "Kategori": r.category || "Lainnya",
      "Toko/Restoran": r.merchant || "-",
      "Nominal (Rp)": r.amount,
      "Catatan": r.note || "-",
      "Link Struk (Drive)": `https://drive.google.com/file/d/${r.fileId}/view`
    }));

    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transaksi");
    
    // Set column widths
    ws["!cols"] = [
      { wch: 5 },  // No
      { wch: 12 }, // Tanggal
      { wch: 20 }, // Keperluan
      { wch: 15 }, // Kategori
      { wch: 20 }, // Merchant
      { wch: 15 }, // Amount
      { wch: 25 }, // Note
      { wch: 45 }  // Drive Link
    ];

    XLSX.writeFile(wb, filename);
    showToast(`Berhasil mengunduh ${dataToExport.length} data`, "success");
    setShowDownloadMenu(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-slate-900 p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-xl shadow-sm" />
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Smart Receipt
                </h1>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Cloud Management</p>
              </div>
            </div>
            <Link 
              href="/insights" 
              className="group flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-white hover:bg-primary-600 bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-full transition-all"
            >
              <TrendingUp className="w-4 h-4" />
              Lihat Insights
              <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
             <div className="flex items-center gap-3">
               <div className="text-right">
                 <p className="text-sm font-bold">{user?.name || "Connected Hub"}</p>
                 <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">Active Sync</p>
               </div>
               {user?.picture ? (
                 <img 
                   src={user.picture} 
                   alt="Profile" 
                   className="h-10 w-10 rounded-full border-2 border-primary-500 shadow-sm"
                 />
               ) : (
                 <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-400" />
                 </div>
               )}
             </div>
             <button 
               onClick={() => {
                 if(confirm("Apakah Anda yakin ingin keluar?")) {
                  logoutAction();
                 }
               }}
               className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
               title="Logout"
             >
               <LogOut className="w-5 h-5" />
             </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-4">
            <UploadForm />
          </div>

          {/* List Section */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold">Riwayat Transaksi</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-slate-500">
                      {filterMonth === "all" ? `${receipts.length} Struk Tersimpan` : `${filteredReceipts.length} Struk ditemukan`}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  {/* Month Filter */}
                  <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-lg">
                    <div className="pl-1.5 pr-0.5">
                      <Filter className="w-3 h-3 text-slate-400" />
                    </div>
                    <select 
                      value={filterMonth}
                      onChange={(e) => setFilterMonth(e.target.value)}
                      className="bg-transparent text-[10px] font-bold uppercase tracking-widest px-1 py-1 outline-hidden cursor-pointer text-slate-800 dark:text-slate-100"
                    >
                      <option value="all">Semua Riwayat</option>
                      {availableMonths.map(m => (
                        <option key={m} value={m}>{formatMonth(m)}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort Controls */}
                  <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-lg">
                    <div className="pl-1.5 pr-0.5">
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as "date" | "amount")}
                      className="bg-transparent text-[10px] font-bold uppercase tracking-widest px-1 py-1 outline-hidden cursor-pointer text-slate-800 dark:text-slate-100"
                    >
                      <option value="date">Terbaru</option>
                      <option value="amount">Terbesar</option>
                    </select>
                  </div>

                  {/* Download Menu */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                      className={cn(
                        "flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white p-1 rounded-lg transition-all",
                        showDownloadMenu && "ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-slate-900"
                      )}
                    >
                      <div className="pl-1.5 pr-0.5">
                        <Download className="w-3 h-3" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest px-1 py-1 pr-2">Excel</span>
                    </button>

                    {showDownloadMenu && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowDownloadMenu(false)}
                        ></div>
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200">
                           <button 
                             onClick={() => handleDownloadExcel("filter")}
                             className="w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors"
                           >
                             <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                             Bulan Terfilter
                           </button>
                           
                           <div className="border-t dark:border-slate-800 my-1"></div>
                           <div className="px-4 py-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Per Tahun</div>
                           {availableYears.map(year => (
                              <button 
                               key={year}
                               onClick={() => handleDownloadExcel(year)}
                               className="w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors"
                             >

                               <CalendarDays className="w-3.5 h-3.5 text-blue-500" />
                               Tahun {year}
                             </button>
                           ))}
                           
                           <div className="border-t dark:border-slate-800 my-1"></div>
                           <button 
                             onClick={() => handleDownloadExcel("all")}
                             className="w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors"
                           >
                             <Database className="w-3.5 h-3.5 text-purple-500" />
                             Seluruh Riwayat
                           </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {receipts.length === 0 ? (
                <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-800/20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <p className="text-slate-400 text-sm">Belum ada struk yang diunggah.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b dark:border-slate-800 text-slate-400">
                        <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest font-bold">Keperluan</th>
                        <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest font-bold">Kategori</th>
                        <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest font-bold">Tanggal</th>
                        <th className="px-6 py-4 text-right text-[10px] uppercase tracking-widest font-bold">Nominal</th>
                        <th className="px-6 py-4 text-right text-[10px] uppercase tracking-widest font-bold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-slate-800">
                      {sortedReceipts.map((receipt) => (
                        <tr key={receipt.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all duration-200">
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{receipt.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{receipt.merchant || "Tanpa Nama Toko"}</p>
                            {receipt.note && (
                              <p className="text-[10px] text-slate-500 italic mt-1 bg-slate-50 dark:bg-slate-800/50 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-800 w-fit">
                                "{receipt.note}"
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
                              {receipt.category || "Lainnya"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-slate-500 whitespace-nowrap">
                            {receipt.date}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-primary-600 text-right">
                            Rp {receipt.amount.toLocaleString("id-ID")}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-1">
                              <button
                                onClick={() => setEditingReceipt(receipt)}
                                className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-md transition-all"
                                title="Edit Data"
                                disabled={isDeleting}
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(receipt.id, receipt.fileId)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all"
                                title="Hapus Data"
                                disabled={isDeleting}
                              >
                                {isDeleting ? <span className="animate-spin text-[10px]">...</span> : <Trash2 className="w-4 h-4" />}
                              </button>
                              <a 
                                href={`https://drive.google.com/file/d/${receipt.fileId}/view`} 
                                target="_blank"
                                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md transition-all"
                                title="Lihat di Drive"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {editingReceipt && (
        <EditModal 
          receipt={editingReceipt} 
          onClose={() => setEditingReceipt(null)} 
        />
      )}
    </main>
  );
}
