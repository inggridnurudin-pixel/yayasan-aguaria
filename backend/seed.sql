-- ============================================================
-- SIDONA — Sistem Informasi Donasi Yayasan
-- FILE    : backend/seed.sql
-- FUNGSI  : Data awal (donatur, penerima, donasi, penyaluran, notifikasi)
-- SYARAT  : Jalankan SETELAH schema.sql
-- ============================================================

-- ── 1. Data Donatur ─────────────────────────────────────────
insert into public.donatur (id, nama, telepon, email, alamat, total_donasi, jumlah_donasi, status, bergabung) values
  ('DON-001', 'PT Maju Bersama',        '021-555-0101',  'info@majubersama.co.id',     'Jl. Sudirman No. 45, Jakarta',     125000000, 8,  'Aktif',       '2023-01-15'),
  ('DON-002', 'Hj. Siti Aminah',        '0812-3456-7890','siti.aminah@gmail.com',      'Jl. Melati No. 12, Bandung',        45000000, 15, 'Aktif',       '2022-06-20'),
  ('DON-003', 'Bapak Ahmad Fauzi',      '0813-2222-3333','ahmad.fauzi@yahoo.com',      'Jl. Mawar No. 8, Surabaya',         32000000, 6,  'Aktif',       '2023-03-10'),
  ('DON-004', 'Yayasan Cahaya Ummat',   '021-777-0202',  'cahaya@ummat.org',           'Jl. Pancasila No. 100, Jakarta',    87500000, 12, 'Aktif',       '2022-09-05'),
  ('DON-005', 'Ibu Nurhayati',          '0815-8888-9999','nurhayati@gmail.com',        'Jl. Anggrek No. 22, Semarang',      15000000, 5,  'Tidak Aktif', '2023-05-18'),
  ('DON-006', 'CV Berkah Jaya',         '024-333-4040',  'berkah@cvjaya.com',          'Jl. Diponegoro No. 77, Semarang',   63000000, 9,  'Aktif',       '2023-02-22'),
  ('DON-007', 'Drs. Hasan Basri',       '0817-5555-6666','hasan.basri@gmail.com',      'Jl. Cendrawasih No. 5, Makassar',   28000000, 7,  'Aktif',       '2022-11-30'),
  ('DON-008', 'PT Sentosa Abadi',       '021-999-8080',  'contact@sentosaabadi.co.id', 'Jl. Thamrin No. 200, Jakarta',     150000000, 10, 'Aktif',       '2022-04-12'),
  ('DON-009', 'Ibu Khadijah',           '0812-1111-2222','khadijah@gmail.com',         'Jl. Kenanga No. 18, Bogor',          9500000, 4,  'Tidak Aktif', '2023-07-25'),
  ('DON-010', 'Keluarga Bapak Yusuf',  '0813-7777-8888','yusuf.family@gmail.com',     'Jl. Flamboyan No. 3, Depok',        42000000, 11, 'Aktif',       '2022-08-14')
on conflict (id) do nothing;

-- ── 2. Data Penerima ────────────────────────────────────────
insert into public.penerima (id, nama, kategori, alamat, telepon, kontak_person, total_diterima, jumlah_penyaluran, status) values
  ('PEN-001', 'Panti Asuhan Ar-Rahman',        'Panti Asuhan', 'Jl. Hj. Halimah No. 15, Jakarta', '021-444-1010',  'Ust. Abdul Rahman', 75000000, 6, 'Aktif'),
  ('PEN-002', 'Masjid Al-Muhajirin',           'Masjid',       'Jl. Masjid No. 1, Bandung',        '022-222-3030',  'Takmir Masjid',     35000000, 4, 'Aktif'),
  ('PEN-003', 'Sekolah Dasar Islam Terpadu',   'Sekolah',      'Jl. Pendidikan No. 88, Surabaya',  '031-555-6060',  'Kepala Sekolah',    52000000, 5, 'Aktif'),
  ('PEN-004', 'Lembaga Sosial Bakti Ummat',    'Lembaga',      'Jl. Sosial No. 45, Jakarta',       '021-888-9090',  'Bpk. Slamet',       68000000, 8, 'Aktif'),
  ('PEN-005', 'Bapak Junaedi (Yatim)',         'Individu',     'Jl. Pesantren No. 7, Bogor',       '0812-9090-1010','Bapak Junaedi',     12000000, 3, 'Aktif'),
  ('PEN-006', 'Panti Asuhan Baitul Maal',      'Panti Asuhan', 'Jl. Ciledug No. 22, Tangerang',   '021-770-8080',  'Ibu Halimah',       45000000, 5, 'Aktif'),
  ('PEN-007', 'Masjid Agung Al-Falah',         'Masjid',       'Jl. Al-Falah No. 1, Semarang',     '024-666-7070',  'Dewan Masjid',      28000000, 3, 'Nonaktif'),
  ('PEN-008', 'Yayasan Pendidikan Al-Hikmah',  'Lembaga',      'Jl. Al-Hikmah No. 50, Depok',      '021-333-5050',  'Bpk. Wijaya',       58000000, 7, 'Aktif')
on conflict (id) do nothing;

-- ── 3. Data Donasi ──────────────────────────────────────────
insert into public.donasi (tanggal, kode, donatur_id, donatur_nama, jenis, nominal, metode, status) values
  ('2026-09-28', 'DNS-2609-001', 'DON-008', 'PT Sentosa Abadi',      'Tunai',  25000000, 'Transfer Bank', 'Lunas'),
  ('2026-09-27', 'DNS-2609-002', 'DON-002', 'Hj. Siti Aminah',       'Infaq',   5000000, 'Tunai',         'Lunas'),
  ('2026-09-26', 'DNS-2609-003', 'DON-001', 'PT Maju Bersama',       'Wakaf',  15000000, 'Transfer Bank', 'Lunas'),
  ('2026-09-25', 'DNS-2609-004', 'DON-004', 'Yayasan Cahaya Ummat',  'Zakat',  12000000, 'QRIS',          'Lunas'),
  ('2026-09-24', 'DNS-2609-005', 'DON-006', 'CV Berkah Jaya',        'Tunai',   8000000, 'Transfer Bank', 'Pending'),
  ('2026-09-23', 'DNS-2609-006', 'DON-003', 'Bapak Ahmad Fauzi',     'Infaq',   3000000, 'E-Wallet',      'Lunas'),
  ('2026-09-22', 'DNS-2609-007', 'DON-010', 'Keluarga Bapak Yusuf', 'Tunai',   7000000, 'Transfer Bank', 'Lunas'),
  ('2026-09-21', 'DNS-2609-008', 'DON-007', 'Drs. Hasan Basri',      'Zakat',   4500000, 'Tunai',         'Lunas'),
  ('2026-09-20', 'DNS-2609-009', 'DON-005', 'Ibu Nurhayati',         'Infaq',   2000000, 'QRIS',          'Gagal'),
  ('2026-09-19', 'DNS-2609-010', 'DON-002', 'Hj. Siti Aminah',       'Wakaf',  10000000, 'Transfer Bank', 'Lunas'),
  ('2026-09-18', 'DNS-2609-011', 'DON-001', 'PT Maju Bersama',       'Tunai',  20000000, 'Cek',           'Lunas'),
  ('2026-09-17', 'DNS-2609-012', 'DON-009', 'Ibu Khadijah',          'Infaq',   1500000, 'E-Wallet',      'Pending'),
  ('2026-09-15', 'DNS-2609-013', 'DON-006', 'CV Berkah Jaya',        'Barang', 18000000, 'Tunai',         'Lunas'),
  ('2026-09-14', 'DNS-2609-014', 'DON-008', 'PT Sentosa Abadi',      'Tunai',  30000000, 'Transfer Bank', 'Lunas'),
  ('2026-09-12', 'DNS-2609-015', 'DON-004', 'Yayasan Cahaya Ummat',  'Zakat',   8500000, 'QRIS',          'Lunas')
on conflict (kode) do nothing;

-- ── 4. Data Penyaluran ──────────────────────────────────────
insert into public.penyaluran (tanggal, kode, penerima_id, penerima_nama, program, nominal, keterangan, status) values
  ('2026-09-27','PNY-2609-001','PEN-001','Panti Asuhan Ar-Rahman',       'Bantuan Sembako Bulanan',  15000000,'Pembelian kebutuhan pokok untuk 45 anak asuh',       'Disalurkan'),
  ('2026-09-25','PNY-2609-002','PEN-004','Lembaga Sosial Bakti Ummat',   'Beasiswa Pendidikan',      20000000,'Beasiswa untuk 20 siswa kurang mampu',                'Disalurkan'),
  ('2026-09-22','PNY-2609-003','PEN-003','Sekolah Dasar Islam Terpadu',  'Renovasi Ruang Kelas',     25000000,'Perbaikan 3 ruang kelas yang rusak',                  'Disalurkan'),
  ('2026-09-20','PNY-2609-004','PEN-002','Masjid Al-Muhajirin',          'Pembelian Karpet Masjid',  12000000,'Penggantian karpet area sholat',                      'Disalurkan'),
  ('2026-09-18','PNY-2609-005','PEN-005','Bapak Junaedi (Yatim)',        'Bantuan Medis',             5000000,'Biaya pengobatan dan obat-obatan',                    'Disalurkan'),
  ('2026-09-15','PNY-2609-006','PEN-006','Panti Asuhan Baitul Maal',     'Bantuan Pendidikan',       18000000,'SPP dan kebutuhan sekolah 30 anak',                   'Disalurkan'),
  ('2026-09-12','PNY-2609-007','PEN-008','Yayasan Pendidikan Al-Hikmah', 'Pengadaan Perpustakaan',   22000000,'Pembelian buku dan rak perpustakaan',                 'Diajukan'),
  ('2026-09-10','PNY-2609-008','PEN-001','Panti Asuhan Ar-Rahman',       'Bantuan Hari Raya',        10000000,'Pakaian dan kue lebaran untuk anak asuh',             'Disalurkan'),
  ('2026-09-08','PNY-2609-009','PEN-007','Masjid Agung Al-Falah',        'Renovasi Tempat Wudhu',    15000000,'Perbaikan saluran air dan keramik',                   'Ditolak'),
  ('2026-09-05','PNY-2609-010','PEN-004','Lembaga Sosial Bakti Ummat',   'Bantuan Bencana Alam',     30000000,'Penyaluran untuk korban banjir',                      'Disalurkan')
on conflict (kode) do nothing;

-- ── 5. Data Notifikasi ──────────────────────────────────────
insert into public.notifikasi (judul, pesan, waktu, dibaca, tipe) values
  ('Donasi Baru Diterima',     'PT Sentosa Abadi telah berdonasi Rp 25.000.000',                           '5 menit lalu', false, 'donasi'),
  ('Penyaluran Diajukan',      'Pengajuan penyaluran ke Yayasan Pendidikan Al-Hikmah menunggu persetujuan', '1 jam lalu',   false, 'penyaluran'),
  ('Donasi Pending',           'Donasi dari CV Berkah Jaya sedang dalam proses verifikasi',                 '3 jam lalu',   false, 'donasi'),
  ('Laporan Bulanan Tersedia', 'Laporan arus dana bulan September 2026 telah dibuat',                       '1 hari lalu',  true,  'sistem'),
  ('Donatur Baru Terdaftar',   'Keluarga Bapak Yusuf telah bergabung sebagai donatur',                      '2 hari lalu',  true,  'sistem');
