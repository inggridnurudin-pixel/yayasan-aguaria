# SIDONA — Sistem Informasi Donasi Yayasan

> Sistem pencatatan dan pengelolaan donasi, penyaluran dana, serta pelaporan keuangan yayasan berbasis web.

---

## 🔗 Link Akses Sistem

| Keterangan | URL |
|---|---|
| **Aplikasi (Live)** | **https://inggridnurudin-pixel.github.io/yayasan-aguaria/** |
| Landing Page | https://inggridnurudin-pixel.github.io/yayasan-aguaria/frontend/index.html |
| Repository | https://github.com/inggridnurudin-pixel/yayasan-aguaria |

---

## 📁 Struktur Folder

```
yayasan-aguaria/
│
├── backend/                  # File SQL untuk database Supabase
│   ├── schema.sql            # Struktur semua tabel & RLS policy
│   ├── seed.sql              # Data awal (donatur, penerima, donasi, penyaluran, notifikasi)
│   ├── seed_tambahan.sql     # Data konfigurasi (profil yayasan, preferensi notifikasi)
│   └── triggers.sql          # Database functions & triggers otomasi statistik
│
├── frontend/                 # Halaman landing page statis
│   ├── index.html            # Halaman utama landing page
│   ├── script.js             # Fetch statistik real-time dari Supabase
│   └── style.css             # Desain responsif landing page
│
├── src/                      # Source code aplikasi React (SPA)
│   ├── components/           # Komponen UI reusable
│   │   ├── charts/           # AreaChart, BarChart, DonutChart
│   │   ├── layout/           # Sidebar, Topbar
│   │   └── ui/               # Badge, Button, Card, Input, Modal, Toast
│   ├── context/
│   │   └── AppContext.tsx    # State management terpusat + Supabase CRUD
│   ├── data/
│   │   └── dummyData.ts      # Data referensi awal
│   ├── lib/
│   │   ├── supabase.ts       # Inisialisasi Supabase client
│   │   ├── services.ts       # Service layer semua operasi database
│   │   └── database.types.ts # Type definisi tabel Supabase
│   ├── pages/                # Halaman-halaman aplikasi
│   │   ├── DashboardPage.tsx
│   │   ├── DonasiPage.tsx
│   │   ├── DonaturPage.tsx
│   │   ├── PenyaluranPage.tsx
│   │   ├── PenerimaPage.tsx
│   │   ├── LaporanPage.tsx
│   │   └── PengaturanPage.tsx
│   ├── types/
│   │   └── index.ts          # Definisi tipe TypeScript
│   └── utils/
│       └── format.ts         # Fungsi format Rupiah, tanggal
│
├── supabase/
│   └── migrations/           # Riwayat migration (referensi)
│
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions — auto deploy ke GitHub Pages
│
├── index.html                # Entry point root (redirect ke frontend/)
├── README.md                 # Dokumentasi proyek ini
├── vite.config.ts            # Konfigurasi Vite + base path GitHub Pages
├── tailwind.config.js        # Konfigurasi Tailwind CSS
├── tsconfig.app.json         # Konfigurasi TypeScript
└── package.json              # Dependencies proyek
```

---

## ✨ Fitur Sistem

| Modul | Fitur |
|---|---|
| **Dashboard** | Ringkasan statistik, grafik donasi & penyaluran 6 bulan, DonutChart komposisi donasi |
| **Donasi** | CRUD lengkap — tambah, edit, hapus, filter status, pagination, kode otomatis |
| **Donatur** | CRUD lengkap — data individu & lembaga, statistik total donasi |
| **Penyaluran Dana** | CRUD + alur persetujuan (Diajukan → Disalurkan), filter status |
| **Penerima Dana** | CRUD — tampilan kartu, filter kategori (Panti, Masjid, Sekolah, dll.) |
| **Laporan** | Filter tanggal, 4 tab: Penerimaan / Penyaluran / Arus Dana / Ringkasan Saldo |
| **Pengaturan** | Profil yayasan, preferensi notifikasi, ubah password — tersimpan ke Supabase |
| **Notifikasi** | Real-time, tandai dibaca satu per satu atau semua sekaligus |

---

## 🛠️ Teknologi

| Layer | Teknologi |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |
| Icons | Lucide React |

---

## 🗄️ Setup Database (Supabase)

Jalankan file SQL berikut secara berurutan di **Supabase Dashboard → SQL Editor**:

```
1. backend/schema.sql         ← Buat semua tabel & aktifkan RLS
2. backend/seed.sql           ← Isi data awal
3. backend/seed_tambahan.sql  ← Isi konfigurasi yayasan
4. backend/triggers.sql       ← Aktifkan functions & triggers
```

---

## 💻 Menjalankan Lokal

```bash
# 1. Clone repository
git clone https://github.com/inggridnurudin-pixel/yayasan-aguaria.git
cd yayasan-aguaria

# 2. Install dependencies
npm install

# 3. Buat file environment
# Buat file .env.local dan isi:
# VITE_SUPABASE_URL=https://zzqngubqelbggezkpaxt.supabase.co
# VITE_SUPABASE_ANON_KEY=<anon key Supabase>

# 4. Jalankan dev server
npm run dev
```

---

## 🚀 Deploy

Aplikasi di-deploy otomatis ke GitHub Pages setiap kali ada push ke branch `main` melalui GitHub Actions (`.github/workflows/deploy.yml`).

---

## 👩‍💻 Dikembangkan oleh

**Inggrid Nurudin** — Universitas Diponegoro  
Repository: https://github.com/inggridnurudin-pixel/yayasan-aguaria
