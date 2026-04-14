import Link from "next/link";
import { ArrowLeft, ScrollText, AlertTriangle, Scale, UserCheck } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-primary-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-900/20 blur-[120px] rounded-full" />
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
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6">
            <ScrollText className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Persyaratan Layanan</h1>
          <p className="text-lg text-slate-400">Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}</p>
        </header>

        <div className="space-y-12 text-slate-300 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-indigo-400" />
              1. Penerimaan Ketentuan
            </h2>
            <p>
              Dengan mengakses atau menggunakan **Smart Receipt Hub**, Anda setuju untuk terikat oleh Persyaratan Layanan ini. Jika Anda tidak menyetujui bagian mana pun dari ketentuan ini, Anda tidak diperkenankan menggunakan aplikasi kami.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Scale className="w-6 h-6 text-indigo-400" />
              2. Penggunaan Layanan
            </h2>
            <p className="mb-4">
              Anda setuju untuk menggunakan layanan kami hanya untuk tujuan yang sah dan sesuai dengan hukum yang berlaku. Anda bertanggung jawab penuh atas:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Menjaga keamanan akun Google Anda.</li>
              <li>Keakuratan data struk yang Anda unggah secara manual.</li>
              <li>Penggunaan data insight keuangan untuk keputusan pribadi Anda.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              3. Batasan Tanggung Jawab
            </h2>
            <p className="mb-4 text-slate-400 italic">
              "Layanan ini disediakan 'sebagaimana adanya' tanpa jaminan apapun."
            </p>
            <p>
              Smart Receipt Hub menggunakan teknologi AI untuk memproses informasi. Kami tidak menjamin akurasi 100% dari hasil ekstraksi data AI. Kami tidak bertanggung jawab atas kerugian finansial atau kesalahan pencatatan yang mungkin timbul akibat ketidaktelitian sistem AI kami.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              4. Perubahan Layanan
            </h2>
            <p>
              Kami berhak untuk mengubah, menangguhkan, atau menghentikan bagian manapun dari layanan ini kapan saja tanpa pemberitahuan sebelumnya, demi meningkatkan kualitas atau alasan keamanan.
            </p>
          </section>

          <section className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-4">Hubungi Kami</h2>
            <p className="text-slate-400 text-sm">
              Jika Anda memiliki saran atau pertanyaan mengenai Ketentuan Layanan ini, silakan hubungi pengembang melalui email di: 
              <span className="text-indigo-400 font-medium ml-1">arliannasrul@gmail.com</span>
            </p>
          </section>
        </div>

        <footer className="mt-20 pt-8 border-t border-slate-900/50 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Smart Receipt Hub. Dibuat dengan integritas.</p>
        </footer>
      </div>
    </div>
  );
}
