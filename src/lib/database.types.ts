/**
 * Type definisi database Supabase SIDONA.
 * Di-generate manual sesuai skema SQL di supabase/migrations/001_init.sql
 * Setelah tabel dibuat di Supabase, bisa di-generate ulang dengan:
 *   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
 */

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      donatur: {
        Row: {
          id: string;
          nama: string;
          telepon: string;
          email: string;
          alamat: string;
          total_donasi: number;
          jumlah_donasi: number;
          status: 'Aktif' | 'Tidak Aktif';
          bergabung: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['donatur']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['donatur']['Insert']>;
      };

      donasi: {
        Row: {
          id: number;
          tanggal: string;
          kode: string;
          donatur_id: string;
          donatur_nama: string;
          jenis: 'Tunai' | 'Barang' | 'Wakaf' | 'Zakat' | 'Infaq';
          nominal: number;
          metode: 'Transfer Bank' | 'Tunai' | 'E-Wallet' | 'QRIS' | 'Cek';
          status: 'Lunas' | 'Pending' | 'Gagal';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['donasi']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['donasi']['Insert']>;
      };

      penerima: {
        Row: {
          id: string;
          nama: string;
          kategori: 'Individu' | 'Lembaga' | 'Panti Asuhan' | 'Sekolah' | 'Masjid';
          alamat: string;
          telepon: string;
          kontak_person: string;
          total_diterima: number;
          jumlah_penyaluran: number;
          status: 'Aktif' | 'Nonaktif';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['penerima']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['penerima']['Insert']>;
      };

      penyaluran: {
        Row: {
          id: number;
          tanggal: string;
          kode: string;
          penerima_id: string;
          penerima_nama: string;
          program: string;
          nominal: number;
          keterangan: string;
          status: 'Disalurkan' | 'Diajukan' | 'Ditolak';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['penyaluran']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['penyaluran']['Insert']>;
      };

      notifikasi: {
        Row: {
          id: number;
          judul: string;
          pesan: string;
          waktu: string;
          dibaca: boolean;
          tipe: 'donasi' | 'penyaluran' | 'sistem';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifikasi']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['notifikasi']['Insert']>;
      };
    };
  };
}
