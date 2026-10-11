/**
 * SIDONA — frontend/script.js
 * Mengambil statistik ringkasan dari Supabase
 * dan menampilkannya di halaman landing page.
 */

// ── Konfigurasi Supabase ────────────────────────────────────
const SUPABASE_URL    = 'https://zzqngubqelbggezkpaxt.supabase.co';
const SUPABASE_ANON   = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6cW5ndWJxZWxiZ2dlemtwYXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2MDg2OTcsImV4cCI6MjEwNjE4NDY5N30.n6DXlHnfxPylPIDB__uR_7ZNFss4u1jkKzBsVx--nQE';

// ── Helper: query REST API Supabase ────────────────────────
async function querySupabase(table, params = '') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    headers: {
      apikey:        SUPABASE_ANON,
      Authorization: `Bearer ${SUPABASE_ANON}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
  return res.json();
}

// ── Helper: format Rupiah singkat ──────────────────────────
function formatRupiahShort(value) {
  if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1)} M`;
  if (value >= 1_000_000)     return `Rp ${(value / 1_000_000).toFixed(0)} Jt`;
  if (value >= 1_000)         return `Rp ${(value / 1_000).toFixed(0)} Rb`;
  return `Rp ${value}`;
}

// ── Muat statistik dari Supabase ───────────────────────────
async function loadStats() {
  try {
    const [donaturRows, donasiRows, penyaluranRows, penerimaRows] = await Promise.all([
      querySupabase('donatur',    'select=status'),
      querySupabase('donasi',     'select=nominal,status'),
      querySupabase('penyaluran', 'select=nominal,status'),
      querySupabase('penerima',   'select=id'),
    ]);

    // Hitung total donasi (hanya status Lunas)
    const totalDonasi = donasiRows
      .filter(d => d.status === 'Lunas')
      .reduce((sum, d) => sum + d.nominal, 0);

    // Hitung total disalurkan
    const totalDisalurkan = penyaluranRows
      .filter(p => p.status === 'Disalurkan')
      .reduce((sum, p) => sum + p.nominal, 0);

    // Donatur aktif
    const donaturAktif = donaturRows.filter(d => d.status === 'Aktif').length;

    // Jumlah penerima
    const jumlahPenerima = penerimaRows.length;

    // Tampilkan ke DOM
    setText('statTotalDonasi',     formatRupiahShort(totalDonasi));
    setText('statTotalDonatur',    `${donaturAktif} Donatur`);
    setText('statTotalPenyaluran', formatRupiahShort(totalDisalurkan));
    setText('statTotalPenerima',   `${jumlahPenerima} Lembaga`);

  } catch (err) {
    console.warn('Gagal memuat statistik:', err.message);
    // Tampilkan tanda strip jika gagal (tidak crash)
    ['statTotalDonasi','statTotalDonatur','statTotalPenyaluran','statTotalPenerima']
      .forEach(id => setText(id, '—'));
  }
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// ── Jalankan saat halaman siap ─────────────────────────────
document.addEventListener('DOMContentLoaded', loadStats);
