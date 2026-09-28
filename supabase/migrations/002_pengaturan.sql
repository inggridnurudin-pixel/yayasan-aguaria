-- ============================================================
-- Migration 002: Tabel pengaturan yayasan & notifikasi preferences
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── 1. Tabel pengaturan (key-value store untuk konfigurasi) ─
create table if not exists public.pengaturan (
  id          bigserial   primary key,
  kunci       text        not null unique,   -- nama setting, e.g. 'profil_yayasan'
  nilai       jsonb       not null default '{}',
  updated_at  timestamptz not null default now()
);

alter table public.pengaturan enable row level security;
create policy "allow_all_pengaturan" on public.pengaturan for all using (true) with check (true);

-- ── 2. Seed data profil yayasan awal ────────────────────────
insert into public.pengaturan (kunci, nilai) values (
  'profil_yayasan',
  '{
    "nama": "Yayasan Amanah Ummat",
    "npy": "1234567890123456",
    "telepon": "021-555-0100",
    "email": "info@amanahummat.org",
    "website": "www.amanahummat.org",
    "provinsi": "DKI Jakarta",
    "alamat": "Jl. Sudirman No. 45, Jakarta Pusat",
    "deskripsi": "Yayasan sosial keagamaan yang berfokus pada pengelolaan dana donasi dan penyaluran kepada yang berhak."
  }'::jsonb
) on conflict (kunci) do nothing;

-- ── 3. Seed preferensi notifikasi awal ──────────────────────
insert into public.pengaturan (kunci, nilai) values (
  'notif_settings',
  '{
    "donasiMasuk": true,
    "penyaluran": true,
    "laporanMingguan": false,
    "donaturBaru": false
  }'::jsonb
) on conflict (kunci) do nothing;

-- ── 4. Function untuk upsert pengaturan ─────────────────────
create or replace function public.upsert_pengaturan(
  p_kunci text,
  p_nilai jsonb
) returns void
language plpgsql security definer as $$
begin
  insert into public.pengaturan (kunci, nilai, updated_at)
  values (p_kunci, p_nilai, now())
  on conflict (kunci)
  do update set nilai = excluded.nilai, updated_at = now();
end;
$$;
