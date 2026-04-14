# Smart Receipt Hub 🧾✨

**Smart Receipt Hub** adalah aplikasi manajemen pengeluaran berbasis AI yang dirancang untuk membantu Anda mengelola struk belanja dengan cara yang paling modern, aman, dan cerdas. 

Aplikasi ini menggabungkan kekuatan **Google Cloud** untuk penyimpanan data pribadi Anda dan **Gemini AI** untuk ekstraksi data struk secara otomatis.

---

## 🚀 Fitur Utama

### 💎 Landing Page Premium
Tampilan depan yang modern, eksklusif, dan dinamis. Dilengkapi dengan animasi halus serta ilustrasi dashboard yang memberikan kesan profesional sejak pandangan pertama.

### 🧠 Sistem Kategorisasi AI
Didukung oleh model terbaru **Gemini AI**, aplikasi ini mampu mengenali jenis pengeluaran Anda secara otomatis (seperti Makanan & Minuman, Belanja, Transportasi, dll) hanya dari sebuah foto struk.

### 📊 Insight Dashboard Lengkap
Pantau kesehatan keuangan Anda dengan visualisasi data yang cerdas:
- **Grafik Batang (Bar Chart)**: Ringkasan pengeluaran bulanan.
- **Grafik Lingkaran (Pie Chart)**: Distribusi pengeluaran berdasarkan kategori untuk melihat ke mana uang Anda paling banyak mengalir.

### 📁 Ekspor Excel Super Lengkap
Butuh laporan fisik atau backup data mandiri? Ekspor seluruh riwayat transaksi Anda ke format Excel dengan opsi:
- Download per bulan tertentu.
- Download per tahun (dinamis).
- Download seluruh riwayat.
*Laporan mencakup semua detail penting, termasuk link langsung ke foto struk di Google Drive.*

### 🔄 Multi-Model Gemini (Auto-Rotation)
Aplikasi ini memiliki ketahanan tinggi terhadap batas kuota API (rate limits). Dengan sistem rotasi API Key otomatis, aplikasi akan terus berjalan lancar dengan berpindah antar key secara transparan.

### 🔐 Keamanan Sesi & Privasi
- **Login Aman**: Menggunakan Google OAuth 2.0 yang tepercaya.
- **Personal Database**: Semua data struk dan file gambar disimpan langsung di **Google Drive pribadi Anda**, bukan di server pihak ketiga. Anda memegang kendali penuh atas data Anda.

### ☁️ Deployment Tanpa Hambatan
Proyek ini sudah terintegrasi sempurna dengan **GitHub** dan ter-hosting otomatis di **Vercel**, memastikan performa aplikasi yang cepat dan selalu up-to-date.

---

## 🛠️ Stack Teknologi

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **AI Engine**: Google Gemini Pro (Generative AI)
- **Cloud Service**: Google Drive API & Google Cloud Platform
- **Authentication**: Iron Session & Google OAuth
- **Charts**: Recharts
- **Deployment**: Vercel

---

## 📦 Cara Menjalankan Lokal

1. Clone repositori ini:
   ```bash
   git clone https://github.com/arliannasrul/Smart-Receipt.git
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Atur file `.env.local` dengan kredensial Google Cloud dan Gemini API Key Anda.
4. Jalankan aplikasi:
   ```bash
   npm run dev
   ```

---

## 🛡️ Lisensi
Proyek ini dibuat untuk keperluan manajemen pengeluaran cerdas dan integrasi komputasi awan.

---
*Built with ❤️ by [Nasrul](https://github.com/arliannasrul)*
