"use client";

import { useState, useMemo } from "react";
import { Receipt, logoutAction } from "@/app/actions/receipts";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend 
} from "recharts";
import { processSpendingData, calculateOverview, processCategoryData } from "@/lib/insight-utils";
import Link from "next/link";
import { ArrowLeft, TrendingUp, CreditCard, Calendar, Filter, LayoutDashboard, LogOut } from "lucide-react";

interface InsightsClientProps {
  receipts: Receipt[];
  user?: {
    name?: string;
    picture?: string;
  };
}

export default function InsightsClient({ receipts, user }: InsightsClientProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  
  const monthlyData = useMemo(() => processSpendingData(receipts), [receipts]);
  const categoryData = useMemo(() => processCategoryData(receipts), [receipts]);
  
  const filteredStats = useMemo(() => {
    if (selectedPeriod === "all") {
      return calculateOverview(receipts);
    }
    const filteredReceipts = receipts.filter(r => {
      const date = new Date(r.date);
      const key = new Intl.DateTimeFormat("id-ID", {
        month: "short",
        year: "2-digit",
      }).format(date);
      return key === selectedPeriod;
    });
    return calculateOverview(filteredReceipts);
  }, [receipts, selectedPeriod]);

  const { total, average, highest } = filteredStats;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-slate-900 p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-primary-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-600 rounded-lg text-white">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Spending Insights</h1>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Data Analytics</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 w-full md:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-transparent text-sm font-medium outline-hidden w-full cursor-pointer"
              >
                <option value="all">Semua Waktu</option>
                {monthlyData.map(d => (
                  <option key={d.month} value={d.month}>{d.month}</option>
                ))}
              </select>
            </div>
            
             <div className="hidden sm:flex items-center gap-4 border-l pl-4 dark:border-slate-800">
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
               {user?.picture && (
                  <img src={user.picture} alt="Profile" className="h-10 w-10 rounded-full border-2 border-primary-500 shadow-sm" />
               )}
             </div>
          </div>
        </header>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 border-l-4 border-l-blue-500">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{selectedPeriod === 'all' ? 'Total Seluruhnya' : 'Total Bulan Ini'}</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">Rp {total.toLocaleString("id-ID")}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 border-l-4 border-l-purple-500">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{selectedPeriod === 'all' ? 'Puncak Bulanan' : 'Transaksi Tertinggi'}</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">Rp {highest.toLocaleString("id-ID")}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 border-l-4 border-l-emerald-500">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Rata-rata {selectedPeriod === 'all' ? 'Transaksi' : 'Bulan Ini'}</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">Rp {Math.round(average).toLocaleString("id-ID")}</p>
            </div>
          </div>
        </div>

        {/* Category Pie Chart Section */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold mb-8 flex items-center gap-2">
            <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
            Distribusi Kategori
          </h2>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="var(--background)"
                  strokeWidth={2}
                >
                  {[
                    "#3b82f6", // Makanan (Blue)
                    "#8b5cf6", // Belanja (Purple)
                    "#ec4899", // Transport (Pink)
                    "#f59e0b", // Hiburan (Amber)
                    "#10b981", // Kesehatan (Emerald)
                    "#06b6d4", // Tagihan (Cyan)
                    "#ef4444", // Pendidikan (Red)
                    "#64748b"  // Lainnya (Slate)
                  ].map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any) => [`Rp ${Number(val).toLocaleString("id-ID")}`, "Total"]}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)'
                  }}
                />
                <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-8">
          {/* Bar Chart */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold mb-8 flex items-center gap-2">
              <span className="w-2 h-6 bg-primary-600 rounded-full"></span>
              Perbandingan Bulanan
            </h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--chart-text)', fontSize: 10, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--chart-text)', fontSize: 10, fontWeight: 600 }}
                    tickFormatter={(val) => `Rp ${val/1000}k`} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                    formatter={(val: any) => [`Rp ${Number(val).toLocaleString("id-ID")}`, "Jumlah"]}
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      backgroundColor: 'var(--background)',
                      color: 'var(--foreground)'
                    }}
                  />
                  <Bar 
                    dataKey="amount" 
                    fill="#3b82f6" 
                    radius={[6, 6, 0, 0]} 
                    background={{ fill: 'var(--chart-grid)', opacity: 0.3, radius: 6 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Area Chart */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold mb-8 flex items-center gap-2">
              <span className="w-2 h-6 bg-purple-600 rounded-full"></span>
              Tren Pengeluaran
            </h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--chart-text)', fontSize: 10, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--chart-text)', fontSize: 10, fontWeight: 600 }}
                    tickFormatter={(val) => `Rp ${val/1000}k`} 
                  />
                  <Tooltip 
                    formatter={(val: any) => [`Rp ${Number(val).toLocaleString("id-ID")}`, "Jumlah"]}
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      backgroundColor: 'var(--background)',
                      color: 'var(--foreground)'
                    }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" activeDot={{ r: 6, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
