import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Database } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-primary-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-20">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-12 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Beranda</span>
        </Link>

        <header className="mb-16">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary-500/10 border border-primary-500/20 mb-6">
            <ShieldCheck className="w-8 h-8 text-primary-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Kebijakan Privasi</h1>
          <p className="text-lg text-slate-400">Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}</p>
        </header>

        <div className="space-y-12 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Database className="w-6 h-6 text-primary-400" />
              1. Informasi yang Kami Kumpulkan
            </h2>
            <p className="mb-4">
              Aplikasi **Smart Receipt Hub** sangat menjunjung tinggi privasi Anda. Kami hanya mengumpulkan informasi yang diperlukan untuk menjalankan layanan inti kami:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Informasi Akun Google</strong>: Email dan Nama Anda digunakan untuk proses autentikasi.</li>
              <li><strong>Data Google Drive</strong>: Aplikasi ini meminta akses ke Google Drive Anda melalui scope <code className="bg-slate-800 px-1.5 py-0.5 rounded text-primary-300">drive.file</code>. Kami hanya mengakses file yang dibuat oleh aplikasi ini (data struk).</li>
              <li><strong>File Gambar</strong>: Gambar struk yang Anda unggah akan diproses sementara untuk dianalisis oleh AI sebelum disimpan di Google Drive pribadi Anda.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Lock className="w-6 h-6 text-primary-400" />
              2. Bagaimana Kami Menggunakan Data Anda
            </h2>
            <p className="mb-4">
              Data Anda digunakan semata-mata untuk:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Menganalisis konten struk belanja menggunakan layanan Gemini AI.</li>
              <li>Menyimpan dan mengelola data transaksi Anda di penyimpanan Google Drive milik Anda sendiri.</li>
              <li>Menampilkan grafik dan insight pengeluaran untuk membantu Anda mengelola keuangan.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <EyeOff className="w-6 h-6 text-primary-400" />
              3. Berbagi Data dengan Pihak Ketiga
            </h2>
            <p className="mb-4">
              Kami **tidak menjual atau menyewakan** data pribadi Anda kepada pihak ketiga manapun. Data gambar struk dikirim ke API **Google Gemini** hanya untuk keperluan pemrosesan AI secara anonim dan tidak disimpan permanen oleh layanan kami.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              4. Keamanan Data
            </h2>
            <p>
              Semua komunikasi data antara browser Anda, server kami, dan layanan Google Google dilindungi dengan enkripsi SSL/TLS. Kami tidak menyimpan salinan permanen dari struk Anda di server kami; semuanya berada di folder aman Google Drive Anda.
            </p>
          </section>

          <section className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 text-center">
            <h2 className="text-xl font-bold text-white mb-4">Punya pertanyaan lebih lanjut?</h2>
            <p className="text-slate-400 mb-6 text-sm">
              Kami senang memberikan bantuan dan transparansi lebih lanjut mengenai data Anda.
            </p>
            <a 
              href="mailto:arliannasrul@gmail.com" 
              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors font-medium"
            >
              Hubungi Pengembang
            </a>
          </section>
        </div>

        <footer className="mt-20 pt-8 border-t border-slate-900/50 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Smart Receipt Hub. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
