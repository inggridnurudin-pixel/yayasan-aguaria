import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { useApp } from '@/context/AppContext';
import { formatRupiah, formatTanggal } from '@/utils/format';
import type { Donasi, JenisDonasi, MetodePembayaran, DonasiStatus } from '@/types';
import { Plus, Search, Pencil, Trash2, HandHeart, Download, AlertTriangle } from 'lucide-react';

const PAGE_SIZE = 8;

const emptyForm = {
  tanggal: new Date().toISOString().split('T')[0],
  donaturId: '',
  donaturNama: '',
  jenis: 'Tunai' as JenisDonasi,
  nominal: '',
  metode: 'Transfer Bank' as MetodePembayaran,
  status: 'Lunas' as DonasiStatus,
  catatan: '',
};

export function DonasiPage() {
  const { donasi, donatur, addDonasi, updateDonasi, deleteDonasi } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Donasi | null>(null);
  const [editTarget, setEditTarget] = useState<Donasi | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState(emptyForm);

  /* ── Filter + Search ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return donasi.filter((d) => {
      const matchSearch =
        d.kode.toLowerCase().includes(q) ||
        d.donaturNama.toLowerCase().includes(q);
      const matchStatus = filterStatus === 'all' || d.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [donasi, search, filterStatus]);

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleFilterChange = (val: string) => {
    setFilterStatus(val);
    setCurrentPage(1);
  };
  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  /* ── Open add modal ── */
  const openAdd = () => {
    setEditTarget(null);
    setForm({ ...emptyForm, tanggal: new Date().toISOString().split('T')[0] });
    setModalOpen(true);
  };

  /* ── Open edit modal ── */
  const openEdit = (d: Donasi) => {
    setEditTarget(d);
    setForm({
      tanggal: d.tanggal,
      donaturId: d.donaturId,
      donaturNama: d.donaturNama,
      jenis: d.jenis,
      nominal: String(d.nominal),
      metode: d.metode,
      status: d.status,
      catatan: '',
    });
    setModalOpen(true);
  };

  /* ── Handle donatur select ── */
  const handleDonaturChange = (id: string) => {
    const don = donatur.find((d) => d.id === id);
    setForm((f) => ({ ...f, donaturId: id, donaturNama: don?.nama ?? '' }));
  };

  /* ── Save ── */
  const handleSave = () => {
    if (!form.donaturId || !form.nominal || Number(form.nominal) <= 0) return;
    if (editTarget) {
      updateDonasi({
        ...editTarget,
        tanggal: form.tanggal,
        donaturId: form.donaturId,
        donaturNama: form.donaturNama,
        jenis: form.jenis,
        nominal: Number(form.nominal),
        metode: form.metode,
        status: form.status,
      });
    } else {
      addDonasi({
        tanggal: form.tanggal,
        donaturId: form.donaturId,
        donaturNama: form.donaturNama,
        jenis: form.jenis,
        nominal: Number(form.nominal),
        metode: form.metode,
        status: form.status,
      });
    }
    setModalOpen(false);
  };

  /* ── Delete confirm ── */
  const confirmDelete = () => {
    if (deleteTarget) deleteDonasi(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-3 flex-1 max-w-xl">
          <div className="flex-1">
            <Input
              placeholder="Cari kode atau nama donatur..."
              icon={<Search size={18} />}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onChange={(e) => handleFilterChange(e.target.value)} className="w-40">
            <option value="all">Semua Status</option>
            <option value="Lunas">Lunas</option>
            <option value="Pending">Pending</option>
            <option value="Gagal">Gagal</option>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="md" onClick={() => alert('Fitur export akan segera tersedia.')}>
            <Download size={16} /> Export
          </Button>
          <Button variant="primary" size="md" onClick={openAdd}>
            <Plus size={16} /> Tambah Donasi
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50/50">
                <th className="text-left font-semibold px-5 py-3.5">Tanggal</th>
                <th className="text-left font-semibold px-5 py-3.5">Kode Donasi</th>
                <th className="text-left font-semibold px-5 py-3.5">Nama Donatur</th>
                <th className="text-left font-semibold px-5 py-3.5">Jenis</th>
                <th className="text-left font-semibold px-5 py-3.5">Nominal</th>
                <th className="text-left font-semibold px-5 py-3.5">Metode</th>
                <th className="text-left font-semibold px-5 py-3.5">Status</th>
                <th className="text-center font-semibold px-5 py-3.5">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-sm text-gray-400">
                    Tidak ada data yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                paginated.map((d) => (
                  <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{formatTanggal(d.tanggal)}</td>
                    <td className="px-5 py-3.5 text-sm font-mono text-gray-600">{d.kode}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">{d.donaturNama}</td>
                    <td className="px-5 py-3.5"><Badge variant="info">{d.jenis}</Badge></td>
                    <td className="px-5 py-3.5 text-sm font-bold text-gray-900">{formatRupiah(d.nominal)}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{d.metode}</td>
                    <td className="px-5 py-3.5"><Badge variant={statusVariant(d.status)}>{d.status}</Badge></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEdit(d)}
                          className="p-1.5 rounded-lg text-gray-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(d)}
                          className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Menampilkan {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–
            {Math.min(safePage * PAGE_SIZE, filtered.length)} dari {filtered.length} transaksi
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={safePage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Sebelumnya
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === safePage ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={safePage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      </Card>

      {/* Modal Tambah / Edit */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? 'Edit Donasi' : 'Tambah Donasi'}
        subtitle={editTarget ? `Mengubah data donasi ${editTarget.kode}` : 'Catat donasi baru dari donatur'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!form.donaturId || !form.nominal || Number(form.nominal) <= 0}
            >
              <HandHeart size={16} /> {editTarget ? 'Perbarui' : 'Simpan'} Donasi
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Tanggal"
            type="date"
            value={form.tanggal}
            onChange={(e) => setForm((f) => ({ ...f, tanggal: e.target.value }))}
          />
          {editTarget ? (
            <Input label="Kode Donasi" value={editTarget.kode} readOnly />
          ) : (
            <Input label="Kode Donasi" value="(otomatis)" readOnly className="text-gray-400 italic" />
          )}
          <Select
            label="Pilih Donatur"
            value={form.donaturId}
            onChange={(e) => handleDonaturChange(e.target.value)}
          >
            <option value="">-- Pilih Donatur --</option>
            {donatur.map((d) => (
              <option key={d.id} value={d.id}>{d.nama}</option>
            ))}
          </Select>
          <Select
            label="Jenis Donasi"
            value={form.jenis}
            onChange={(e) => setForm((f) => ({ ...f, jenis: e.target.value as JenisDonasi }))}
          >
            <option>Tunai</option>
            <option>Barang</option>
            <option>Wakaf</option>
            <option>Zakat</option>
            <option>Infaq</option>
          </Select>
          <Input
            label="Nominal (Rp)"
            type="number"
            min="1"
            placeholder="0"
            value={form.nominal}
            onChange={(e) => setForm((f) => ({ ...f, nominal: e.target.value }))}
          />
          <Select
            label="Metode Pembayaran"
            value={form.metode}
            onChange={(e) => setForm((f) => ({ ...f, metode: e.target.value as MetodePembayaran }))}
          >
            <option>Transfer Bank</option>
            <option>Tunai</option>
            <option>E-Wallet</option>
            <option>QRIS</option>
            <option>Cek</option>
          </Select>
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as DonasiStatus }))}
          >
            <option>Lunas</option>
            <option>Pending</option>
            <option>Gagal</option>
          </Select>
          <div className="sm:col-span-2">
            <Input
              label="Catatan (Opsional)"
              placeholder="Tambah catatan untuk donasi ini..."
              value={form.catatan}
              onChange={(e) => setForm((f) => ({ ...f, catatan: e.target.value }))}
            />
          </div>
        </div>
      </Modal>

      {/* Modal Konfirmasi Hapus */}
      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Konfirmasi Hapus"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Batal</Button>
            <Button variant="danger" onClick={confirmDelete}>
              <Trash2 size={16} /> Ya, Hapus
            </Button>
          </>
        }
      >
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle size={28} className="text-red-500" />
          </div>
          <p className="text-sm text-gray-700">
            Yakin ingin menghapus donasi{' '}
            <span className="font-bold text-gray-900">{deleteTarget?.kode}</span> dari{' '}
            <span className="font-bold text-gray-900">{deleteTarget?.donaturNama}</span>?
          </p>
          <p className="text-xs text-gray-400">Tindakan ini tidak dapat dibatalkan.</p>
        </div>
      </Modal>
    </div>
  );
}
