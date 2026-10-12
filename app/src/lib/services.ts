/**
 * Supabase service layer — semua operasi database terpusat di sini.
 * Kolom di DB memakai snake_case; fungsi mapper di bawah mengubahnya
 * ke camelCase yang dipakai di seluruh komponen React.
 */

import { supabase } from './supabase';
import type {
  Donasi, Donatur, Penyaluran, Penerima, Notifikasi,
  JenisDonasi, MetodePembayaran, DonasiStatus,
  DonaturStatus, PenyaluranStatus, PenerimaKategori, PenerimaStatus,
} from '@/types';

/* ═══════════════════════════════════════════════════════════════
   MAPPERS  DB row → App type
═══════════════════════════════════════════════════════════════ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDonatur(r: any): Donatur {
  return {
    id: r.id,
    nama: r.nama,
    telepon: r.telepon,
    email: r.email,
    alamat: r.alamat,
    totalDonasi: r.total_donasi,
    jumlahDonasi: r.jumlah_donasi,
    status: r.status as DonaturStatus,
    bergabung: r.bergabung,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDonasi(r: any): Donasi {
  return {
    id: r.id,
    tanggal: r.tanggal,
    kode: r.kode,
    donaturId: r.donatur_id,
    donaturNama: r.donatur_nama,
    jenis: r.jenis as JenisDonasi,
    nominal: r.nominal,
    metode: r.metode as MetodePembayaran,
    status: r.status as DonasiStatus,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPenerima(r: any): Penerima {
  return {
    id: r.id,
    nama: r.nama,
    kategori: r.kategori as PenerimaKategori,
    alamat: r.alamat,
    telepon: r.telepon,
    kontakPerson: r.kontak_person,
    totalDiterima: r.total_diterima,
    jumlahPenyaluran: r.jumlah_penyaluran,
    status: r.status as PenerimaStatus,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPenyaluran(r: any): Penyaluran {
  return {
    id: r.id,
    tanggal: r.tanggal,
    kode: r.kode,
    penerimaId: r.penerima_id,
    penerimaNama: r.penerima_nama,
    program: r.program,
    nominal: r.nominal,
    keterangan: r.keterangan,
    status: r.status as PenyaluranStatus,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapNotifikasi(r: any): Notifikasi {
  return {
    id: r.id,
    judul: r.judul,
    pesan: r.pesan,
    waktu: r.waktu,
    dibaca: r.dibaca,
    tipe: r.tipe as 'donasi' | 'penyaluran' | 'sistem',
  };
}

/* ═══════════════════════════════════════════════════════════════
   FETCH ALL
═══════════════════════════════════════════════════════════════ */
export async function fetchAllData() {
  const [
    { data: donaturRows, error: e1 },
    { data: donasiRows,  error: e2 },
    { data: penerimaRows, error: e3 },
    { data: penyaluranRows, error: e4 },
    { data: notifRows,  error: e5 },
  ] = await Promise.all([
    supabase.from('donatur').select('*').order('created_at', { ascending: false }),
    supabase.from('donasi').select('*').order('tanggal', { ascending: false }),
    supabase.from('penerima').select('*').order('created_at', { ascending: false }),
    supabase.from('penyaluran').select('*').order('tanggal', { ascending: false }),
    supabase.from('notifikasi').select('*').order('created_at', { ascending: false }),
  ]);

  const firstError = e1 ?? e2 ?? e3 ?? e4 ?? e5;
  if (firstError) throw new Error(firstError.message);

  return {
    donatur:    (donaturRows    ?? []).map(mapDonatur),
    donasi:     (donasiRows     ?? []).map(mapDonasi),
    penerima:   (penerimaRows   ?? []).map(mapPenerima),
    penyaluran: (penyaluranRows ?? []).map(mapPenyaluran),
    notifikasi: (notifRows      ?? []).map(mapNotifikasi),
  };
}

/* ═══════════════════════════════════════════════════════════════
   DONASI
═══════════════════════════════════════════════════════════════ */
export async function insertDonasi(d: Omit<Donasi, 'id' | 'kode'>, kode: string): Promise<Donasi> {
  const { data, error } = await supabase
    .from('donasi')
    .insert({
      tanggal:      d.tanggal,
      kode,
      donatur_id:   d.donaturId,
      donatur_nama: d.donaturNama,
      jenis:        d.jenis,
      nominal:      d.nominal,
      metode:       d.metode,
      status:       d.status,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Update stats donatur
  await supabase.rpc('increment_donatur_stats', {
    p_donatur_id: d.donaturId,
    p_nominal:    d.nominal,
  }).maybeSingle();

  return mapDonasi(data);
}

export async function updateDonasiDb(d: Donasi): Promise<void> {
  const { error } = await supabase
    .from('donasi')
    .update({
      tanggal:      d.tanggal,
      donatur_id:   d.donaturId,
      donatur_nama: d.donaturNama,
      jenis:        d.jenis,
      nominal:      d.nominal,
      metode:       d.metode,
      status:       d.status,
    })
    .eq('id', d.id);

  if (error) throw new Error(error.message);
}

export async function deleteDonasiDb(id: number): Promise<void> {
  const { error } = await supabase.from('donasi').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

/* ═══════════════════════════════════════════════════════════════
   DONATUR
═══════════════════════════════════════════════════════════════ */
export async function insertDonatur(
  d: Omit<Donatur, 'totalDonasi' | 'jumlahDonasi' | 'bergabung'>,
  bergabung: string
): Promise<Donatur> {
  const { data, error } = await supabase
    .from('donatur')
    .insert({
      id:           d.id,
      nama:         d.nama,
      telepon:      d.telepon,
      email:        d.email,
      alamat:       d.alamat,
      status:       d.status,
      total_donasi: 0,
      jumlah_donasi: 0,
      bergabung,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapDonatur(data);
}

export async function updateDonaturDb(d: Donatur): Promise<void> {
  const { error } = await supabase
    .from('donatur')
    .update({
      nama:    d.nama,
      telepon: d.telepon,
      email:   d.email,
      alamat:  d.alamat,
      status:  d.status,
    })
    .eq('id', d.id);

  if (error) throw new Error(error.message);
}

export async function deleteDonaturDb(id: string): Promise<void> {
  const { error } = await supabase.from('donatur').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

/* ═══════════════════════════════════════════════════════════════
   PENYALURAN
═══════════════════════════════════════════════════════════════ */
export async function insertPenyaluran(
  p: Omit<Penyaluran, 'id' | 'kode'>,
  kode: string
): Promise<Penyaluran> {
  const { data, error } = await supabase
    .from('penyaluran')
    .insert({
      tanggal:       p.tanggal,
      kode,
      penerima_id:   p.penerimaId,
      penerima_nama: p.penerimaNama,
      program:       p.program,
      nominal:       p.nominal,
      keterangan:    p.keterangan,
      status:        p.status,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Update stats penerima
  await supabase.rpc('increment_penerima_stats', {
    p_penerima_id: p.penerimaId,
    p_nominal:     p.nominal,
  }).maybeSingle();

  return mapPenyaluran(data);
}

export async function updatePenyaluranDb(p: Penyaluran): Promise<void> {
  const { error } = await supabase
    .from('penyaluran')
    .update({
      tanggal:       p.tanggal,
      penerima_id:   p.penerimaId,
      penerima_nama: p.penerimaNama,
      program:       p.program,
      nominal:       p.nominal,
      keterangan:    p.keterangan,
      status:        p.status,
    })
    .eq('id', p.id);

  if (error) throw new Error(error.message);
}

export async function deletePenyaluranDb(id: number): Promise<void> {
  const { error } = await supabase.from('penyaluran').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

/* ═══════════════════════════════════════════════════════════════
   PENERIMA
═══════════════════════════════════════════════════════════════ */
export async function insertPenerima(p: Penerima): Promise<Penerima> {
  const { data, error } = await supabase
    .from('penerima')
    .insert({
      id:                p.id,
      nama:              p.nama,
      kategori:          p.kategori,
      alamat:            p.alamat,
      telepon:           p.telepon,
      kontak_person:     p.kontakPerson,
      total_diterima:    0,
      jumlah_penyaluran: 0,
      status:            p.status,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapPenerima(data);
}

export async function updatePenerimaDb(p: Penerima): Promise<void> {
  const { error } = await supabase
    .from('penerima')
    .update({
      nama:          p.nama,
      kategori:      p.kategori,
      alamat:        p.alamat,
      telepon:       p.telepon,
      kontak_person: p.kontakPerson,
      status:        p.status,
    })
    .eq('id', p.id);

  if (error) throw new Error(error.message);
}

export async function deletePenerimaDb(id: string): Promise<void> {
  const { error } = await supabase.from('penerima').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

/* ═══════════════════════════════════════════════════════════════
   NOTIFIKASI
═══════════════════════════════════════════════════════════════ */
export async function insertNotifikasi(
  n: Omit<Notifikasi, 'id'>
): Promise<Notifikasi> {
  const { data, error } = await supabase
    .from('notifikasi')
    .insert({
      judul:  n.judul,
      pesan:  n.pesan,
      waktu:  n.waktu,
      dibaca: n.dibaca,
      tipe:   n.tipe,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapNotifikasi(data);
}

export async function markNotifReadDb(id: number): Promise<void> {
  const { error } = await supabase
    .from('notifikasi')
    .update({ dibaca: true })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function markAllNotifReadDb(): Promise<void> {
  const { error } = await supabase
    .from('notifikasi')
    .update({ dibaca: true })
    .eq('dibaca', false);
  if (error) throw new Error(error.message);
}

/* ═══════════════════════════════════════════════════════════════
   HELPER: Fetch donatur terbaru dari DB (untuk sinkronisasi stats)
═══════════════════════════════════════════════════════════════ */
export async function fetchDonaturById(id: string): Promise<Donatur | null> {
  const { data, error } = await supabase
    .from('donatur')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return mapDonatur(data);
}

export async function fetchPenerimaById(id: string): Promise<Penerima | null> {
  const { data, error } = await supabase
    .from('penerima')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return mapPenerima(data);
}

/* ═══════════════════════════════════════════════════════════════
   PENGATURAN (key-value store di tabel pengaturan)
═══════════════════════════════════════════════════════════════ */

export interface ProfilYayasan {
  nama: string;
  npy: string;
  telepon: string;
  email: string;
  website: string;
  provinsi: string;
  alamat: string;
  deskripsi: string;
}

export interface NotifSettingsDb {
  donasiMasuk: boolean;
  penyaluran: boolean;
  laporanMingguan: boolean;
  donaturBaru: boolean;
}

/** Ambil satu nilai pengaturan berdasarkan kunci */
export async function fetchPengaturan<T>(kunci: string, fallback: T): Promise<T> {
  const { data, error } = await supabase
    .from('pengaturan')
    .select('nilai')
    .eq('kunci', kunci)
    .maybeSingle();

  if (error || !data) return fallback;
  return data.nilai as T;
}

/** Simpan / update nilai pengaturan */
export async function savePengaturan<T extends object>(kunci: string, nilai: T): Promise<void> {
  const { error } = await supabase
    .from('pengaturan')
    .upsert(
      { kunci, nilai: nilai as Record<string, unknown>, updated_at: new Date().toISOString() },
      { onConflict: 'kunci' }
    );

  if (error) throw new Error(error.message);
}
