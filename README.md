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
├── app/                      # Source code aplikasi React (SPA)
│   ├── src/
│   │   ├── components/       # Komponen UI reusable (charts, layout, ui)
│   │   ├── context/          # State management + Supabase CRUD
│   │   ├── data/             # Data dummy referensi awal
│   │   ├── lib/              # Supabase client, services, database types
│   │   ├── pages/            # Halaman: Dashboard, Donasi, Donatur, dll.
│   │   ├── types/            # Definisi tipe TypeScript
│   │   └── utils/            # Format Rupiah, tanggal
│   ├── public/               # Asset statis (404.html untuk SPA routing)
│   ├── index.html            # Entry point Vite
│   ├── package.json          # Dependencies
│   ├── vite.config.ts        # Konfigurasi Vite + base path
│   ├── tailwind.config.js    # Konfigurasi Tailwind CSS
│   └── tsconfig.json         # Konfigurasi TypeScript
│
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions — auto deploy ke GitHub Pages
│
├── README.md                 # Dokumentasi proyek ini
└── (tidak ada file lain di root)
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
cd yayasan-aguaria/app

# 2. Install dependencies
npm install

# 3. Buat file .env.local di dalam folder app/
echo "VITE_SUPABASE_URL=https://zzqngubqelbggezkpaxt.supabase.co" > .env.local
echo "VITE_SUPABASE_ANON_KEY=<anon key>" >> .env.local

# 4. Jalankan dev server
npm run dev
```

---

## 👩‍💻 Dikembangkan oleh

**Inggrid Nurudin** — Universitas Diponegoro  
Repository: https://github.com/inggridnurudin-pixel/yayasan-aguaria
