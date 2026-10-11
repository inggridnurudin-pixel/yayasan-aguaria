-- ============================================================
-- SIDONA — Sistem Informasi Donasi Yayasan
-- FILE    : backend/triggers.sql
-- FUNGSI  : Database functions & triggers untuk otomasi statistik
-- SYARAT  : Jalankan SETELAH schema.sql
-- ============================================================

-- ── 1. Function: Update statistik donatur ───────────────────
-- Dipanggil setelah insert donasi baru untuk menambah
-- total_donasi dan jumlah_donasi pada tabel donatur
create or replace function public.increment_donatur_stats(
  p_donatur_id text,
  p_nominal    bigint
) returns void
language plpgsql security definer as $$
begin
  update public.donatur
  set
    total_donasi  = total_donasi  + p_nominal,
    jumlah_donasi = jumlah_donasi + 1
  where id = p_donatur_id;
end;
$$;

-- ── 2. Function: Update statistik penerima ──────────────────
-- Dipanggil setelah insert penyaluran baru untuk menambah
-- total_diterima dan jumlah_penyaluran pada tabel penerima
create or replace function public.increment_penerima_stats(
  p_penerima_id text,
  p_nominal     bigint
) returns void
language plpgsql security definer as $$
begin
  update public.penerima
  set
    total_diterima    = total_diterima    + p_nominal,
    jumlah_penyaluran = jumlah_penyaluran + 1
  where id = p_penerima_id;
end;
$$;

-- ── 3. Function: Upsert pengaturan ──────────────────────────
-- Menyimpan atau memperbarui nilai konfigurasi pada tabel pengaturan
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

-- ── 4. Trigger: Auto-update updated_at pada tabel pengaturan ─
-- Secara otomatis memperbarui kolom updated_at setiap kali
-- baris pada tabel pengaturan diubah
create or replace function public.set_updated_at()
returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_pengaturan_updated_at on public.pengaturan;
create trigger trg_pengaturan_updated_at
  before update on public.pengaturan
  for each row execute function public.set_updated_at();

-- ── 5. Trigger: Catat notifikasi otomatis saat donasi masuk ──
-- Setiap donasi baru yang berstatus 'Lunas' akan otomatis
-- membuat entri notifikasi di tabel notifikasi
create or replace function public.notif_donasi_baru()
returns trigger
language plpgsql security definer as $$
begin
  if new.status = 'Lunas' then
    insert into public.notifikasi (judul, pesan, waktu, dibaca, tipe)
    values (
      'Donasi Baru Diterima',
      new.donatur_nama || ' telah berdonasi Rp ' ||
        to_char(new.nominal, 'FM999,999,999,999'),
      'Baru saja',
      false,
      'donasi'
    );
  end if;
  return new;
end;
$$;

drop trigger if exists trg_notif_donasi on public.donasi;
create trigger trg_notif_donasi
  after insert on public.donasi
  for each row execute function public.notif_donasi_baru();

-- ── 6. Trigger: Catat notifikasi saat penyaluran diajukan ────
-- Setiap penyaluran dengan status 'Diajukan' akan membuat
-- notifikasi untuk persetujuan admin
create or replace function public.notif_penyaluran_baru()
returns trigger
language plpgsql security definer as $$
begin
  if new.status = 'Diajukan' then
    insert into public.notifikasi (judul, pesan, waktu, dibaca, tipe)
    values (
      'Penyaluran Diajukan',
      'Pengajuan penyaluran ke ' || new.penerima_nama || ' menunggu persetujuan',
      'Baru saja',
      false,
      'penyaluran'
    );
  end if;
  return new;
end;
$$;

drop trigger if exists trg_notif_penyaluran on public.penyaluran;
create trigger trg_notif_penyaluran
  after insert on public.penyaluran
  for each row execute function public.notif_penyaluran_baru();
