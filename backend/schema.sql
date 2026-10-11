-- ============================================================
-- SIDONA — Sistem Informasi Donasi Yayasan
-- FILE    : backend/schema.sql
-- FUNGSI  : Mendefinisikan struktur semua tabel database
-- CARA    : Jalankan di Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ── 1. Tabel donatur ────────────────────────────────────────
-- Menyimpan data identitas dan statistik setiap donatur
create table if not exists public.donatur (
  id             text        primary key,           -- Format: DON-001, DON-002, dst.
  nama           text        not null,
  telepon        text        not null default '',
  email          text        not null default '',
  alamat         text        not null default '',
  total_donasi   bigint      not null default 0,    -- Total nominal donasi (Rupiah)
  jumlah_donasi  integer     not null default 0,    -- Jumlah transaksi donasi
  status         text        not null default 'Aktif'
                   check (status in ('Aktif', 'Tidak Aktif')),
  bergabung      date        not null default current_date,
  created_at     timestamptz not null default now()
);

-- ── 2. Tabel donasi ─────────────────────────────────────────
-- Menyimpan setiap transaksi donasi yang masuk
create table if not exists public.donasi (
  id             bigserial   primary key,
  tanggal        date        not null,
  kode           text        not null unique,        -- Format: DNS-MMYY-NNN
  donatur_id     text        not null references public.donatur(id) on delete restrict,
  donatur_nama   text        not null,
  jenis          text        not null
                   check (jenis in ('Tunai', 'Barang', 'Wakaf', 'Zakat', 'Infaq')),
  nominal        bigint      not null check (nominal > 0),
  metode         text        not null
                   check (metode in ('Transfer Bank', 'Tunai', 'E-Wallet', 'QRIS', 'Cek')),
  status         text        not null default 'Lunas'
                   check (status in ('Lunas', 'Pending', 'Gagal')),
  created_at     timestamptz not null default now()
);

-- ── 3. Tabel penerima ───────────────────────────────────────
-- Menyimpan data penerima manfaat dana yayasan
create table if not exists public.penerima (
  id                 text        primary key,        -- Format: PEN-001, PEN-002, dst.
  nama               text        not null,
  kategori           text        not null
                       check (kategori in ('Individu', 'Lembaga', 'Panti Asuhan', 'Sekolah', 'Masjid')),
  alamat             text        not null default '',
  telepon            text        not null default '',
  kontak_person      text        not null default '',
  total_diterima     bigint      not null default 0,  -- Total nominal yang diterima (Rupiah)
  jumlah_penyaluran  integer     not null default 0,  -- Jumlah kali menerima penyaluran
  status             text        not null default 'Aktif'
                       check (status in ('Aktif', 'Nonaktif')),
  created_at         timestamptz not null default now()
);

-- ── 4. Tabel penyaluran ─────────────────────────────────────
-- Menyimpan setiap transaksi penyaluran dana ke penerima
create table if not exists public.penyaluran (
  id            bigserial   primary key,
  tanggal       date        not null,
  kode          text        not null unique,          -- Format: PNY-MMYY-NNN
  penerima_id   text        not null references public.penerima(id) on delete restrict,
  penerima_nama text        not null,
  program       text        not null,                 -- Nama program/kegiatan
  nominal       bigint      not null check (nominal > 0),
  keterangan    text        not null default '',
  status        text        not null default 'Diajukan'
                  check (status in ('Disalurkan', 'Diajukan', 'Ditolak')),
  created_at    timestamptz not null default now()
);

-- ── 5. Tabel notifikasi ─────────────────────────────────────
-- Menyimpan riwayat notifikasi aktivitas sistem
create table if not exists public.notifikasi (
  id          bigserial   primary key,
  judul       text        not null,
  pesan       text        not null,
  waktu       text        not null default 'Baru saja',
  dibaca      boolean     not null default false,
  tipe        text        not null default 'sistem'
                check (tipe in ('donasi', 'penyaluran', 'sistem')),
  created_at  timestamptz not null default now()
);

-- ── 6. Tabel pengaturan ─────────────────────────────────────
-- Key-value store untuk konfigurasi aplikasi (profil yayasan, preferensi, dll.)
create table if not exists public.pengaturan (
  id          bigserial   primary key,
  kunci       text        not null unique,
  nilai       jsonb       not null default '{}',
  updated_at  timestamptz not null default now()
);

-- ── 7. Index performa query ─────────────────────────────────
create index if not exists idx_donasi_donatur_id   on public.donasi(donatur_id);
create index if not exists idx_donasi_status        on public.donasi(status);
create index if not exists idx_donasi_tanggal       on public.donasi(tanggal desc);
create index if not exists idx_penyaluran_penerima  on public.penyaluran(penerima_id);
create index if not exists idx_penyaluran_status    on public.penyaluran(status);
create index if not exists idx_penyaluran_tanggal   on public.penyaluran(tanggal desc);
create index if not exists idx_notifikasi_dibaca    on public.notifikasi(dibaca);

-- ── 8. Row Level Security (RLS) ─────────────────────────────
alter table public.donatur     enable row level security;
alter table public.donasi      enable row level security;
alter table public.penerima    enable row level security;
alter table public.penyaluran  enable row level security;
alter table public.notifikasi  enable row level security;
alter table public.pengaturan  enable row level security;

-- Policy: izinkan akses penuh via anon key
-- (untuk single-tenant; ganti dengan auth.uid() jika multi-user)
create policy "allow_all_donatur"    on public.donatur    for all using (true) with check (true);
create policy "allow_all_donasi"     on public.donasi     for all using (true) with check (true);
create policy "allow_all_penerima"   on public.penerima   for all using (true) with check (true);
create policy "allow_all_penyaluran" on public.penyaluran for all using (true) with check (true);
create policy "allow_all_notifikasi" on public.notifikasi for all using (true) with check (true);
create policy "allow_all_pengaturan" on public.pengaturan for all using (true) with check (true);
