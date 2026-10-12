import type {
  Donasi,
  Donatur,
  Penyaluran,
  Penerima,
  Notifikasi,
} from '@/types';

export const donaturData: Donatur[] = [
  { id: 'DON-001', nama: 'PT Maju Bersama', telepon: '021-555-0101', email: 'info@majubersama.co.id', alamat: 'Jl. Sudirman No. 45, Jakarta', totalDonasi: 125000000, jumlahDonasi: 8, status: 'Aktif', bergabung: '2023-01-15' },
  { id: 'DON-002', nama: 'Hj. Siti Aminah', telepon: '0812-3456-7890', email: 'siti.aminah@gmail.com', alamat: 'Jl. Melati No. 12, Bandung', totalDonasi: 45000000, jumlahDonasi: 15, status: 'Aktif', bergabung: '2022-06-20' },
  { id: 'DON-003', nama: 'Bapak Ahmad Fauzi', telepon: '0813-2222-3333', email: 'ahmad.fauzi@yahoo.com', alamat: 'Jl. Mawar No. 8, Surabaya', totalDonasi: 32000000, jumlahDonasi: 6, status: 'Aktif', bergabung: '2023-03-10' },
  { id: 'DON-004', nama: 'Yayasan Cahaya Ummat', telepon: '021-777-0202', email: 'cahaya@ummat.org', alamat: 'Jl. Pancasila No. 100, Jakarta', totalDonasi: 87500000, jumlahDonasi: 12, status: 'Aktif', bergabung: '2022-09-05' },
  { id: 'DON-005', nama: 'Ibu Nurhayati', telepon: '0815-8888-9999', email: 'nurhayati@gmail.com', alamat: 'Jl. Anggrek No. 22, Semarang', totalDonasi: 15000000, jumlahDonasi: 5, status: 'Tidak Aktif', bergabung: '2023-05-18' },
  { id: 'DON-006', nama: 'CV Berkah Jaya', telepon: '024-333-4040', email: 'berkah@cvjaya.com', alamat: 'Jl. Diponegoro No. 77, Semarang', totalDonasi: 63000000, jumlahDonasi: 9, status: 'Aktif', bergabung: '2023-02-22' },
  { id: 'DON-007', nama: 'Drs. Hasan Basri', telepon: '0817-5555-6666', email: 'hasan.basri@gmail.com', alamat: 'Jl. Cendrawasih No. 5, Makassar', totalDonasi: 28000000, jumlahDonasi: 7, status: 'Aktif', bergabung: '2022-11-30' },
  { id: 'DON-008', nama: 'PT Sentosa Abadi', telepon: '021-999-8080', email: 'contact@sentosaabadi.co.id', alamat: 'Jl. Thamrin No. 200, Jakarta', totalDonasi: 150000000, jumlahDonasi: 10, status: 'Aktif', bergabung: '2022-04-12' },
  { id: 'DON-009', nama: 'Ibu Khadijah', telepon: '0812-1111-2222', email: 'khadijah@gmail.com', alamat: 'Jl. Kenanga No. 18, Bogor', totalDonasi: 9500000, jumlahDonasi: 4, status: 'Tidak Aktif', bergabung: '2023-07-25' },
  { id: 'DON-010', nama: 'Keluarga Bapak Yusuf', telepon: '0813-7777-8888', email: 'yusuf.family@gmail.com', alamat: 'Jl. Flamboyan No. 3, Depok', totalDonasi: 42000000, jumlahDonasi: 11, status: 'Aktif', bergabung: '2022-08-14' },
];

export const penerimaData: Penerima[] = [
  { id: 'PEN-001', nama: 'Panti Asuhan Ar-Rahman', kategori: 'Panti Asuhan', alamat: 'Jl. Hj. Halimah No. 15, Jakarta', telepon: '021-444-1010', kontakPerson: 'Ust. Abdul Rahman', totalDiterima: 75000000, jumlahPenyaluran: 6, status: 'Aktif' },
  { id: 'PEN-002', nama: 'Masjid Al-Muhajirin', kategori: 'Masjid', alamat: 'Jl. Masjid No. 1, Bandung', telepon: '022-222-3030', kontakPerson: 'Takmir Masjid', totalDiterima: 35000000, jumlahPenyaluran: 4, status: 'Aktif' },
  { id: 'PEN-003', nama: 'Sekolah Dasar Islam Terpadu', kategori: 'Sekolah', alamat: 'Jl. Pendidikan No. 88, Surabaya', telepon: '031-555-6060', kontakPerson: 'Kepala Sekolah', totalDiterima: 52000000, jumlahPenyaluran: 5, status: 'Aktif' },
  { id: 'PEN-004', nama: 'Lembaga Sosial Bakti Ummat', kategori: 'Lembaga', alamat: 'Jl. Sosial No. 45, Jakarta', telepon: '021-888-9090', kontakPerson: 'Bpk. Slamet', totalDiterima: 68000000, jumlahPenyaluran: 8, status: 'Aktif' },
  { id: 'PEN-005', nama: 'Bapak Junaedi (Yatim)', kategori: 'Individu', alamat: 'Jl. Pesantren No. 7, Bogor', telepon: '0812-9090-1010', kontakPerson: 'Bapak Junaedi', totalDiterima: 12000000, jumlahPenyaluran: 3, status: 'Aktif' },
  { id: 'PEN-006', nama: 'Panti Asuhan Baitul Maal', kategori: 'Panti Asuhan', alamat: 'Jl. Ciledug No. 22, Tangerang', telepon: '021-770-8080', kontakPerson: 'Ibu Halimah', totalDiterima: 45000000, jumlahPenyaluran: 5, status: 'Aktif' },
  { id: 'PEN-007', nama: 'Masjid Agung Al-Falah', kategori: 'Masjid', alamat: 'Jl. Al-Falah No. 1, Semarang', telepon: '024-666-7070', kontakPerson: 'Dewan Masjid', totalDiterima: 28000000, jumlahPenyaluran: 3, status: 'Nonaktif' },
  { id: 'PEN-008', nama: 'Yayasan Pendidikan Al-Hikmah', kategori: 'Lembaga', alamat: 'Jl. Al-Hikmah No. 50, Depok', telepon: '021-333-5050', kontakPerson: 'Bpk. Wijaya', totalDiterima: 58000000, jumlahPenyaluran: 7, status: 'Aktif' },
];

export const donasiData: Donasi[] = [
  { id: 1, tanggal: '2026-09-28', kode: 'DNS-2609-001', donaturId: 'DON-008', donaturNama: 'PT Sentosa Abadi', jenis: 'Tunai', nominal: 25000000, metode: 'Transfer Bank', status: 'Lunas' },
  { id: 2, tanggal: '2026-09-27', kode: 'DNS-2609-002', donaturId: 'DON-002', donaturNama: 'Hj. Siti Aminah', jenis: 'Infaq', nominal: 5000000, metode: 'Tunai', status: 'Lunas' },
  { id: 3, tanggal: '2026-09-26', kode: 'DNS-2609-003', donaturId: 'DON-001', donaturNama: 'PT Maju Bersama', jenis: 'Wakaf', nominal: 15000000, metode: 'Transfer Bank', status: 'Lunas' },
  { id: 4, tanggal: '2026-09-25', kode: 'DNS-2609-004', donaturId: 'DON-004', donaturNama: 'Yayasan Cahaya Ummat', jenis: 'Zakat', nominal: 12000000, metode: 'QRIS', status: 'Lunas' },
  { id: 5, tanggal: '2026-09-24', kode: 'DNS-2609-005', donaturId: 'DON-006', donaturNama: 'CV Berkah Jaya', jenis: 'Tunai', nominal: 8000000, metode: 'Transfer Bank', status: 'Pending' },
  { id: 6, tanggal: '2026-09-23', kode: 'DNS-2609-006', donaturId: 'DON-003', donaturNama: 'Bapak Ahmad Fauzi', jenis: 'Infaq', nominal: 3000000, metode: 'E-Wallet', status: 'Lunas' },
  { id: 7, tanggal: '2026-09-22', kode: 'DNS-2609-007', donaturId: 'DON-010', donaturNama: 'Keluarga Bapak Yusuf', jenis: 'Tunai', nominal: 7000000, metode: 'Transfer Bank', status: 'Lunas' },
  { id: 8, tanggal: '2026-09-21', kode: 'DNS-2609-008', donaturId: 'DON-007', donaturNama: 'Drs. Hasan Basri', jenis: 'Zakat', nominal: 4500000, metode: 'Tunai', status: 'Lunas' },
  { id: 9, tanggal: '2026-09-20', kode: 'DNS-2609-009', donaturId: 'DON-005', donaturNama: 'Ibu Nurhayati', jenis: 'Infaq', nominal: 2000000, metode: 'QRIS', status: 'Gagal' },
  { id: 10, tanggal: '2026-09-19', kode: 'DNS-2609-010', donaturId: 'DON-002', donaturNama: 'Hj. Siti Aminah', jenis: 'Wakaf', nominal: 10000000, metode: 'Transfer Bank', status: 'Lunas' },
  { id: 11, tanggal: '2026-09-18', kode: 'DNS-2609-011', donaturId: 'DON-001', donaturNama: 'PT Maju Bersama', jenis: 'Tunai', nominal: 20000000, metode: 'Cek', status: 'Lunas' },
  { id: 12, tanggal: '2026-09-17', kode: 'DNS-2609-012', donaturId: 'DON-009', donaturNama: 'Ibu Khadijah', jenis: 'Infaq', nominal: 1500000, metode: 'E-Wallet', status: 'Pending' },
  { id: 13, tanggal: '2026-09-15', kode: 'DNS-2609-013', donaturId: 'DON-006', donaturNama: 'CV Berkah Jaya', jenis: 'Barang', nominal: 18000000, metode: 'Tunai', status: 'Lunas' },
  { id: 14, tanggal: '2026-09-14', kode: 'DNS-2609-014', donaturId: 'DON-008', donaturNama: 'PT Sentosa Abadi', jenis: 'Tunai', nominal: 30000000, metode: 'Transfer Bank', status: 'Lunas' },
  { id: 15, tanggal: '2026-09-12', kode: 'DNS-2609-015', donaturId: 'DON-004', donaturNama: 'Yayasan Cahaya Ummat', jenis: 'Zakat', nominal: 8500000, metode: 'QRIS', status: 'Lunas' },
];

export const penyaluranData: Penyaluran[] = [
  { id: 1, tanggal: '2026-09-27', kode: 'PNY-2609-001', penerimaId: 'PEN-001', penerimaNama: 'Panti Asuhan Ar-Rahman', program: 'Bantuan Sembako Bulanan', nominal: 15000000, keterangan: 'Pembelian kebutuhan pokok untuk 45 anak asuh', status: 'Disalurkan' },
  { id: 2, tanggal: '2026-09-25', kode: 'PNY-2609-002', penerimaId: 'PEN-004', penerimaNama: 'Lembaga Sosial Bakti Ummat', program: 'Beasiswa Pendidikan', nominal: 20000000, keterangan: 'Beasiswa untuk 20 siswa kurang mampu', status: 'Disalurkan' },
  { id: 3, tanggal: '2026-09-22', kode: 'PNY-2609-003', penerimaId: 'PEN-003', penerimaNama: 'Sekolah Dasar Islam Terpadu', program: 'Renovasi Ruang Kelas', nominal: 25000000, keterangan: 'Perbaikan 3 ruang kelas yang rusak', status: 'Disalurkan' },
  { id: 4, tanggal: '2026-09-20', kode: 'PNY-2609-004', penerimaId: 'PEN-002', penerimaNama: 'Masjid Al-Muhajirin', program: 'Pembelian Karpet Masjid', nominal: 12000000, keterangan: 'Penggantian karpet area sholat', status: 'Disalurkan' },
  { id: 5, tanggal: '2026-09-18', kode: 'PNY-2609-005', penerimaId: 'PEN-005', penerimaNama: 'Bapak Junaedi (Yatim)', program: 'Bantuan Medis', nominal: 5000000, keterangan: 'Biaya pengobatan dan obat-obatan', status: 'Disalurkan' },
  { id: 6, tanggal: '2026-09-15', kode: 'PNY-2609-006', penerimaId: 'PEN-006', penerimaNama: 'Panti Asuhan Baitul Maal', program: 'Bantuan Pendidikan', nominal: 18000000, keterangan: 'SPP dan kebutuhan sekolah 30 anak', status: 'Disalurkan' },
  { id: 7, tanggal: '2026-09-12', kode: 'PNY-2609-007', penerimaId: 'PEN-008', penerimaNama: 'Yayasan Pendidikan Al-Hikmah', program: 'Pengadaan Perpustakaan', nominal: 22000000, keterangan: 'Pembelian buku dan rak perpustakaan', status: 'Diajukan' },
  { id: 8, tanggal: '2026-09-10', kode: 'PNY-2609-008', penerimaId: 'PEN-001', penerimaNama: 'Panti Asuhan Ar-Rahman', program: 'Bantuan Hari Raya', nominal: 10000000, keterangan: 'Pakaian dan kue lebaran untuk anak asuh', status: 'Disalurkan' },
  { id: 9, tanggal: '2026-09-08', kode: 'PNY-2609-009', penerimaId: 'PEN-007', penerimaNama: 'Masjid Agung Al-Falah', program: 'Renovasi Tempat Wudhu', nominal: 15000000, keterangan: 'Perbaikan saluran air dan keramik', status: 'Ditolak' },
  { id: 10, tanggal: '2026-09-05', kode: 'PNY-2609-010', penerimaId: 'PEN-004', penerimaNama: 'Lembaga Sosial Bakti Ummat', program: 'Bantuan Bencana Alam', nominal: 30000000, keterangan: 'Penyaluran untuk korban banjir', status: 'Disalurkan' },
];

export const notifikasiData: Notifikasi[] = [
  { id: 1, judul: 'Donasi Baru Diterima', pesan: 'PT Sentosa Abadi telah berdonasi Rp 25.000.000', waktu: '5 menit lalu', dibaca: false, tipe: 'donasi' },
  { id: 2, judul: 'Penyaluran Diajukan', pesan: 'Pengajuan penyaluran ke Yayasan Pendidikan Al-Hikmah menunggu persetujuan', waktu: '1 jam lalu', dibaca: false, tipe: 'penyaluran' },
  { id: 3, judul: 'Donasi Pending', pesan: 'Donasi dari CV Berkah Jaya sedang dalam proses verifikasi', waktu: '3 jam lalu', dibaca: false, tipe: 'donasi' },
  { id: 4, judul: 'Laporan Bulanan Tersedia', pesan: 'Laporan arusdana bulan September 2026 telah dibuat', waktu: '1 hari lalu', dibaca: true, tipe: 'sistem' },
  { id: 5, judul: 'Donatur Baru Terdaftar', pesan: 'Keluarga Bapak Yusuf telah bergabung sebagai donatur', waktu: '2 hari lalu', dibaca: true, tipe: 'sistem' },
];

export const chartDonasiBulanan = [
  { bulan: 'Apr', nilai: 42000000 },
  { bulan: 'Mei', nilai: 55000000 },
  { bulan: 'Jun', nilai: 38000000 },
  { bulan: 'Jul', nilai: 67000000 },
  { bulan: 'Agu', nilai: 72000000 },
  { bulan: 'Sep', nilai: 95000000 },
];

export const chartPenyaluranBulanan = [
  { bulan: 'Apr', nilai: 30000000 },
  { bulan: 'Mei', nilai: 45000000 },
  { bulan: 'Jun', nilai: 35000000 },
  { bulan: 'Jul', nilai: 55000000 },
  { bulan: 'Agu', nilai: 60000000 },
  { bulan: 'Sep', nilai: 82000000 },
];
