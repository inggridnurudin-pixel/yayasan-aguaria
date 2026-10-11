-- ============================================================
-- SIDONA — Sistem Informasi Donasi Yayasan
-- FILE    : backend/seed_tambahan.sql
-- FUNGSI  : Data tambahan — konfigurasi profil yayasan & preferensi notifikasi
-- SYARAT  : Jalankan SETELAH schema.sql dan seed.sql
-- ============================================================

-- ── 1. Profil Yayasan ───────────────────────────────────────
-- Menyimpan informasi identitas yayasan yang tampil di halaman Pengaturan
insert into public.pengaturan (kunci, nilai) values (
  'profil_yayasan',
  '{
    "nama":      "Yayasan Amanah Ummat",
    "npy":       "1234567890123456",
    "telepon":   "021-555-0100",
    "email":     "info@amanahummat.org",
    "website":   "www.amanahummat.org",
    "provinsi":  "DKI Jakarta",
    "alamat":    "Jl. Sudirman No. 45, Jakarta Pusat",
    "deskripsi": "Yayasan sosial keagamaan yang berfokus pada pengelolaan dana donasi dan penyaluran kepada yang berhak."
  }'::jsonb
) on conflict (kunci) do nothing;

-- ── 2. Preferensi Notifikasi ────────────────────────────────
-- Menyimpan toggle notifikasi yang dipilih pengguna di halaman Pengaturan
insert into public.pengaturan (kunci, nilai) values (
  'notif_settings',
  '{
    "donasiMasuk":     true,
    "penyaluran":      true,
    "laporanMingguan": false,
    "donaturBaru":     false
  }'::jsonb
) on conflict (kunci) do nothing;
