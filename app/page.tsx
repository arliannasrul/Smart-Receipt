import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";
import { getReceiptData } from "@/app/actions/receipts";
import DashboardClient from "@/components/DashboardClient";
import { Shield, Zap, BarChart3, Sparkles, CheckCircle, Database } from "lucide-react";
import Link from "next/link";

export default async function Dashboard() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  
  if (!session.isLoggedIn) {
    return (
      <main className="min-h-screen bg-slate-950 text-white selection:bg-primary-500/30 overflow-x-hidden font-sans">
        {/* Background Ornaments */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
        </div>

        {/* Header */}
        <header className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-linear-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
               <span className="text-xl font-bold">S</span>
             </div>
             <span className="text-xl font-bold tracking-tight">Smart Receipt Hub</span>
          </div>
          <a
            href="/api/auth/google"
            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-sm font-semibold transition-all"
          >
            Sign In
          </a>
        </header>

        {/* Hero Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <div className="space-y-8 reveal-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                AI-Powered Management
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-none">
                Manage Receipts <br />
                <span className="bg-linear-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-glow">
                  Like Magic.
                </span>
              </h1>
              
              <p className="text-lg text-slate-400 max-w-md leading-relaxed">
                Transform your messy receipts into organized cloud data. 
                Powered by Gemini AI and secured by Google Cloud.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <a
                  href="/api/auth/google"
                  className="w-full sm:w-auto px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl transition-all transform hover:scale-105 shadow-2xl shadow-primary-500/30 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Get Started Free
                </a>
                <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                       {String.fromCharCode(64 + i)}
                     </div>
                   ))}
                   <div className="pl-6 text-sm text-slate-500 font-medium">+1k users</div>
                </div>
              </div>
           </div>

           <div className="relative reveal-up delay-200">
              <div className="absolute inset-0 bg-primary-500/20 blur-[60px] rounded-full animate-float"></div>
              <div className="relative glass p-4 rounded-[2.5rem] border-white/10 shadow-2xl animate-float overflow-hidden">
                <img 
                  src="/hero.png" 
                  alt="Dashboard Preview" 
                  className="rounded-[1.8rem] shadow-2xl grayscale-[0.2] hover:grayscale-0 transition-all duration-700 w-full"
                />
              </div>
              
              {/* Floating Badges */}
              <div className="absolute -top-6 -right-6 glass p-4 rounded-2xl shadow-xl animate-float delay-700 hidden md:block">
                 <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="absolute -bottom-6 -left-6 glass p-4 rounded-2xl shadow-xl animate-float delay-1000 hidden md:block">
                 <Zap className="w-6 h-6 text-yellow-400" />
              </div>
           </div>
        </section>

        {/* Features Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass p-8 rounded-3xl group hover:border-primary-500/50 transition-all">
                 <div className="w-12 h-12 bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-500 mb-6 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold mb-3 italic">Gemini AI Scanner</h3>
                 <p className="text-slate-400 text-sm leading-relaxed">
                   Extract data from any receipt with incredible precision using the latest Gemini models.
                 </p>
              </div>

              <div className="glass p-8 rounded-3xl group hover:border-emerald-500/50 transition-all">
                 <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                    <Database className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold mb-3 italic">Google Drive Sync</h3>
                 <p className="text-slate-400 text-sm leading-relaxed">
                   Your receipts are stored directly in your personal Google Drive. Safe, private, and permanent.
                 </p>
              </div>

              <div className="glass p-8 rounded-3xl group hover:border-purple-500/50 transition-all">
                 <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold mb-3 italic">Smart Insights</h3>
                 <p className="text-slate-400 text-sm leading-relaxed">
                   Beautifully visualized dashboards to help you track your monthly spending habits.
                 </p>
              </div>
           </div>
        </section>

        {/* Footer info */}
        <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 text-center border-t border-white/5 space-y-4">
           <div className="flex justify-center gap-6 text-xs font-semibold text-slate-500">
             <Link href="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link>
             <Link href="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link>
           </div>
           <p className="text-slate-600 text-[10px] font-medium uppercase tracking-[0.2em]">
             Built with Precision by Next.js & Google Cloud
           </p>
        </footer>
      </main>
    );
  }

  const receipts = await getReceiptData();

  return <DashboardClient receipts={receipts} user={session.user} />;
}
