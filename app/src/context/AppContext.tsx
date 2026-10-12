import {
  createContext, useContext, useState, useCallback,
  useEffect, type ReactNode,
} from 'react';
import type { Donasi, Donatur, Penyaluran, Penerima, Notifikasi } from '@/types';
import {
  fetchAllData,
  insertDonasi, updateDonasiDb, deleteDonasiDb,
  insertDonatur, updateDonaturDb, deleteDonaturDb,
  insertPenyaluran, updatePenyaluranDb, deletePenyaluranDb,
  insertPenerima, updatePenerimaDb, deletePenerimaDb,
  insertNotifikasi, markNotifReadDb, markAllNotifReadDb,
  fetchDonaturById, fetchPenerimaById,
} from '@/lib/services';

/* ──────────────────────────────────────────────
   Toast
────────────────────────────────────────────── */
export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

/* ──────────────────────────────────────────────
   Context shape
────────────────────────────────────────────── */
interface AppContextValue {
  // Status inisialisasi
  loading: boolean;
  initError: string | null;

  // Data
  donasi: Donasi[];
  donatur: Donatur[];
  penyaluran: Penyaluran[];
  penerima: Penerima[];
  notifikasi: Notifikasi[];

  // Donasi CRUD
  addDonasi: (d: Omit<Donasi, 'id' | 'kode'>) => Promise<void>;
  updateDonasi: (d: Donasi) => Promise<void>;
  deleteDonasi: (id: number) => Promise<void>;

  // Donatur CRUD
  addDonatur: (d: Omit<Donatur, 'id' | 'totalDonasi' | 'jumlahDonasi' | 'bergabung'>) => Promise<void>;
  updateDonatur: (d: Donatur) => Promise<void>;
  deleteDonatur: (id: string) => Promise<void>;

  // Penyaluran CRUD
  addPenyaluran: (p: Omit<Penyaluran, 'id' | 'kode'>) => Promise<void>;
  updatePenyaluran: (p: Penyaluran) => Promise<void>;
  deletePenyaluran: (id: number) => Promise<void>;

  // Penerima CRUD
  addPenerima: (p: Omit<Penerima, 'id' | 'totalDiterima' | 'jumlahPenyaluran'>) => Promise<void>;
  updatePenerima: (p: Penerima) => Promise<void>;
  deletePenerima: (id: string) => Promise<void>;

  // Notifikasi
  markAllNotifRead: () => Promise<void>;
  markNotifRead: (id: number) => Promise<void>;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: number) => void;
}

/* ──────────────────────────────────────────────
   Helpers — kode generator (sama dengan versi lama)
────────────────────────────────────────────── */
function nextDonasiKode(list: Donasi[]): string {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yy = String(now.getFullYear()).slice(2);
  const prefix = `DNS-${mm}${yy}-`;
  const nums = list
    .filter((d) => d.kode.startsWith(prefix))
    .map((d) => parseInt(d.kode.split('-')[2] ?? '0', 10));
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return `${prefix}${String(next).padStart(3, '0')}`;
}

function nextPenyaluranKode(list: Penyaluran[]): string {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yy = String(now.getFullYear()).slice(2);
  const prefix = `PNY-${mm}${yy}-`;
  const nums = list
    .filter((p) => p.kode.startsWith(prefix))
    .map((p) => parseInt(p.kode.split('-')[2] ?? '0', 10));
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return `${prefix}${String(next).padStart(3, '0')}`;
}

function nextDonaturId(list: Donatur[]): string {
  const nums = list.map((d) => parseInt(d.id.split('-')[1] ?? '0', 10));
  const maxNum = nums.length ? Math.max(...nums) : 0;
  return `DON-${String(maxNum + 1).padStart(3, '0')}`;
}

function nextPenerimaId(list: Penerima[]): string {
  const nums = list.map((p) => parseInt(p.id.split('-')[1] ?? '0', 10));
  const maxNum = nums.length ? Math.max(...nums) : 0;
  return `PEN-${String(maxNum + 1).padStart(3, '0')}`;
}

/* ──────────────────────────────────────────────
   Context
────────────────────────────────────────────── */
const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  const [donasi, setDonasi] = useState<Donasi[]>([]);
  const [donatur, setDonatur] = useState<Donatur[]>([]);
  const [penyaluran, setPenyaluran] = useState<Penyaluran[]>([]);
  const [penerima, setPenerima] = useState<Penerima[]>([]);
  const [notifikasi, setNotifikasi] = useState<Notifikasi[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  /* ── Muat semua data dari Supabase saat pertama kali mount ── */
  useEffect(() => {
    fetchAllData()
      .then((data) => {
        setDonatur(data.donatur);
        setDonasi(data.donasi);
        setPenerima(data.penerima);
        setPenyaluran(data.penyaluran);
        setNotifikasi(data.notifikasi);
      })
      .catch((err: Error) => {
        setInitError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /* ── Toast ── */
  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* ════════════════════════════════════════════
     DONASI
  ════════════════════════════════════════════ */
  const addDonasi = useCallback(
    async (d: Omit<Donasi, 'id' | 'kode'>) => {
      const kode = nextDonasiKode(donasi);
      try {
        const newItem = await insertDonasi(d, kode);
        setDonasi((prev) => [newItem, ...prev]);

        // Sinkronkan stats donatur dari DB
        const updatedDonatur = await fetchDonaturById(d.donaturId);
        if (updatedDonatur) {
          setDonatur((prev) => prev.map((x) => x.id === updatedDonatur.id ? updatedDonatur : x));
        }

        // Notifikasi
        const notif = await insertNotifikasi({
          judul: 'Donasi Baru Diterima',
          pesan: `${d.donaturNama} telah berdonasi ${new Intl.NumberFormat('id-ID', {
            style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
          }).format(d.nominal)}`,
          waktu: 'Baru saja',
          dibaca: false,
          tipe: 'donasi',
        });
        setNotifikasi((prev) => [notif, ...prev]);
        showToast('Donasi berhasil disimpan ke database');
      } catch (e) {
        showToast(`Gagal menyimpan donasi: ${(e as Error).message}`, 'error');
      }
    },
    [donasi, showToast]
  );

  const updateDonasi = useCallback(
    async (d: Donasi) => {
      try {
        await updateDonasiDb(d);
        setDonasi((prev) => prev.map((x) => (x.id === d.id ? d : x)));
        showToast('Donasi berhasil diperbarui');
      } catch (e) {
        showToast(`Gagal memperbarui donasi: ${(e as Error).message}`, 'error');
      }
    },
    [showToast]
  );

  const deleteDonasi = useCallback(
    async (id: number) => {
      try {
        await deleteDonasiDb(id);
        setDonasi((prev) => prev.filter((x) => x.id !== id));
        showToast('Donasi berhasil dihapus', 'info');
      } catch (e) {
        showToast(`Gagal menghapus donasi: ${(e as Error).message}`, 'error');
      }
    },
    [showToast]
  );

  /* ════════════════════════════════════════════
     DONATUR
  ════════════════════════════════════════════ */
  const addDonatur = useCallback(
    async (d: Omit<Donatur, 'id' | 'totalDonasi' | 'jumlahDonasi' | 'bergabung'>) => {
      const id = nextDonaturId(donatur);
      const bergabung = new Date().toISOString().split('T')[0];
      try {
        const newItem = await insertDonatur({ ...d, id }, bergabung);
        setDonatur((prev) => [newItem, ...prev]);
        showToast('Donatur berhasil didaftarkan ke database');
      } catch (e) {
        showToast(`Gagal mendaftarkan donatur: ${(e as Error).message}`, 'error');
      }
    },
    [donatur, showToast]
  );

  const updateDonatur = useCallback(
    async (d: Donatur) => {
      try {
        await updateDonaturDb(d);
        setDonatur((prev) => prev.map((x) => (x.id === d.id ? d : x)));
        showToast('Data donatur berhasil diperbarui');
      } catch (e) {
        showToast(`Gagal memperbarui donatur: ${(e as Error).message}`, 'error');
      }
    },
    [showToast]
  );

  const deleteDonatur = useCallback(
    async (id: string) => {
      try {
        await deleteDonaturDb(id);
        setDonatur((prev) => prev.filter((x) => x.id !== id));
        showToast('Donatur berhasil dihapus', 'info');
      } catch (e) {
        showToast(`Gagal menghapus donatur: ${(e as Error).message}`, 'error');
      }
    },
    [showToast]
  );

  /* ════════════════════════════════════════════
     PENYALURAN
  ════════════════════════════════════════════ */
  const addPenyaluran = useCallback(
    async (p: Omit<Penyaluran, 'id' | 'kode'>) => {
      const kode = nextPenyaluranKode(penyaluran);
      try {
        const newItem = await insertPenyaluran(p, kode);
        setPenyaluran((prev) => [newItem, ...prev]);

        // Sinkronkan stats penerima dari DB
        const updatedPenerima = await fetchPenerimaById(p.penerimaId);
        if (updatedPenerima) {
          setPenerima((prev) => prev.map((x) => x.id === updatedPenerima.id ? updatedPenerima : x));
        }

        const notif = await insertNotifikasi({
          judul: 'Penyaluran Diajukan',
          pesan: `Penyaluran ke ${p.penerimaNama} menunggu persetujuan`,
          waktu: 'Baru saja',
          dibaca: false,
          tipe: 'penyaluran',
        });
        setNotifikasi((prev) => [notif, ...prev]);
        showToast('Penyaluran berhasil disimpan ke database');
      } catch (e) {
        showToast(`Gagal menyimpan penyaluran: ${(e as Error).message}`, 'error');
      }
    },
    [penyaluran, showToast]
  );

  const updatePenyaluran = useCallback(
    async (p: Penyaluran) => {
      try {
        await updatePenyaluranDb(p);
        setPenyaluran((prev) => prev.map((x) => (x.id === p.id ? p : x)));
        showToast('Penyaluran berhasil diperbarui');
      } catch (e) {
        showToast(`Gagal memperbarui penyaluran: ${(e as Error).message}`, 'error');
      }
    },
    [showToast]
  );

  const deletePenyaluran = useCallback(
    async (id: number) => {
      try {
        await deletePenyaluranDb(id);
        setPenyaluran((prev) => prev.filter((x) => x.id !== id));
        showToast('Penyaluran berhasil dihapus', 'info');
      } catch (e) {
        showToast(`Gagal menghapus penyaluran: ${(e as Error).message}`, 'error');
      }
    },
    [showToast]
  );

  /* ════════════════════════════════════════════
     PENERIMA
  ════════════════════════════════════════════ */
  const addPenerima = useCallback(
    async (p: Omit<Penerima, 'id' | 'totalDiterima' | 'jumlahPenyaluran'>) => {
      const id = nextPenerimaId(penerima);
      try {
        const newItem = await insertPenerima({ ...p, id, totalDiterima: 0, jumlahPenyaluran: 0 });
        setPenerima((prev) => [newItem, ...prev]);
        showToast('Penerima berhasil didaftarkan ke database');
      } catch (e) {
        showToast(`Gagal mendaftarkan penerima: ${(e as Error).message}`, 'error');
      }
    },
    [penerima, showToast]
  );

  const updatePenerima = useCallback(
    async (p: Penerima) => {
      try {
        await updatePenerimaDb(p);
        setPenerima((prev) => prev.map((x) => (x.id === p.id ? p : x)));
        showToast('Data penerima berhasil diperbarui');
      } catch (e) {
        showToast(`Gagal memperbarui penerima: ${(e as Error).message}`, 'error');
      }
    },
    [showToast]
  );

  const deletePenerima = useCallback(
    async (id: string) => {
      try {
        await deletePenerimaDb(id);
        setPenerima((prev) => prev.filter((x) => x.id !== id));
        showToast('Penerima berhasil dihapus', 'info');
      } catch (e) {
        showToast(`Gagal menghapus penerima: ${(e as Error).message}`, 'error');
      }
    },
    [showToast]
  );

  /* ════════════════════════════════════════════
     NOTIFIKASI
  ════════════════════════════════════════════ */
  const markAllNotifRead = useCallback(async () => {
    try {
      await markAllNotifReadDb();
      setNotifikasi((prev) => prev.map((n) => ({ ...n, dibaca: true })));
    } catch (e) {
      showToast(`Error: ${(e as Error).message}`, 'error');
    }
  }, [showToast]);

  const markNotifRead = useCallback(async (id: number) => {
    try {
      await markNotifReadDb(id);
      setNotifikasi((prev) => prev.map((n) => (n.id === id ? { ...n, dibaca: true } : n)));
    } catch (e) {
      showToast(`Error: ${(e as Error).message}`, 'error');
    }
  }, [showToast]);

  return (
    <AppContext.Provider
      value={{
        loading,
        initError,
        donasi,
        donatur,
        penyaluran,
        penerima,
        notifikasi,
        addDonasi,
        updateDonasi,
        deleteDonasi,
        addDonatur,
        updateDonatur,
        deleteDonatur,
        addPenyaluran,
        updatePenyaluran,
        deletePenyaluran,
        addPenerima,
        updatePenerima,
        deletePenerima,
        markAllNotifRead,
        markNotifRead,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
