export type PageKey =
  | 'dashboard'
  | 'donasi'
  | 'donatur'
  | 'penyaluran'
  | 'penerima'
  | 'laporan'
  | 'pengaturan';

export type DonasiStatus = 'Lunas' | 'Pending' | 'Gagal';
export type JenisDonasi = 'Tunai' | 'Barang' | 'Wakaf' | 'Zakat' | 'Infaq';
export type MetodePembayaran = 'Transfer Bank' | 'Tunai' | 'E-Wallet' | 'QRIS' | 'Cek';

export interface Donasi {
  id: number;
  tanggal: string;
  kode: string;
  donaturId: string;
  donaturNama: string;
  jenis: JenisDonasi;
  nominal: number;
  metode: MetodePembayaran;
  status: DonasiStatus;
}

export type DonaturStatus = 'Aktif' | 'Tidak Aktif';

export interface Donatur {
  id: string;
  nama: string;
  telepon: string;
  email: string;
  alamat: string;
  totalDonasi: number;
  jumlahDonasi: number;
  status: DonaturStatus;
  bergabung: string;
}

export type PenyaluranStatus = 'Disalurkan' | 'Diajukan' | 'Ditolak';

export interface Penyaluran {
  id: number;
  tanggal: string;
  kode: string;
  penerimaId: string;
  penerimaNama: string;
  program: string;
  nominal: number;
  keterangan: string;
  status: PenyaluranStatus;
}

export type PenerimaKategori = 'Individu' | 'Lembaga' | 'Panti Asuhan' | 'Sekolah' | 'Masjid';
export type PenerimaStatus = 'Aktif' | 'Nonaktif';

export interface Penerima {
  id: string;
  nama: string;
  kategori: PenerimaKategori;
  alamat: string;
  telepon: string;
  kontakPerson: string;
  totalDiterima: number;
  jumlahPenyaluran: number;
  status: PenerimaStatus;
}

export interface Notifikasi {
  id: number;
  judul: string;
  pesan: string;
  waktu: string;
  dibaca: boolean;
  tipe: 'donasi' | 'penyaluran' | 'sistem';
}
