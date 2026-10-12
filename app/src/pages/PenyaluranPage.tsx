import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { useApp } from '@/context/AppContext';
import { formatRupiah, formatTanggal } from '@/utils/format';
import type { Penyaluran, PenyaluranStatus } from '@/types';
import { Plus, Search, Pencil, Trash2, ArrowRightLeft, Download, AlertTriangle, CheckCircle } from 'lucide-react';

const emptyForm = {
  tanggal: new Date().toISOString().split('T')[0],
  penerimaId: '',
  penerimaNama: '',
  program: '',
  nominal: '',
  keterangan: '',
  status: 'Diajukan' as PenyaluranStatus,
};

export function PenyaluranPage() {
  const { penyaluran, penerima, addPenyaluran, updatePenyaluran, deletePenyaluran } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Penyaluran | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Penyaluran | null>(null);
  const [approveTarget, setApproveTarget] = useState<Penyaluran | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return penyaluran.filter((p) => {
      const matchSearch =
        p.kode.toLowerCase().includes(q) ||
        p.penerimaNama.toLowerCase().includes(q) ||
        p.program.toLowerCase().includes(q);
      const matchStatus = filterStatus === 'all' || p.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [penyaluran, search, filterStatus]);

  const totalDisalurkan = penyaluran
    .filter((p) => p.status === 'Disalurkan')
    .reduce((s, p) => s + p.nominal, 0);
  const menunggu = penyaluran.filter((p) => p.status === 'Diajukan').length;

  const openAdd = () => {
    setEditTarget(null);
    setForm({ ...emptyForm, tanggal: new Date().toISOString().split('T')[0] });
    setModalOpen(true);
  };

  const openEdit = (p: Penyaluran) => {
    setEditTarget(p);
    setForm({
      tanggal: p.tanggal,
      penerimaId: p.penerimaId,
      penerimaNama: p.penerimaNama,
      program: p.program,
      nominal: String(p.nominal),
      keterangan: p.keterangan,
      status: p.status,
    });
    setModalOpen(true);
  };

  const handlePenerimaChange = (id: string) => {
    const pen = penerima.find((p) => p.id === id);
    setForm((f) => ({ ...f, penerimaId: id, penerimaNama: pen?.nama ?? '' }));
  };

  const handleSave = () => {
    if (!form.penerimaId || !form.program.trim() || !form.nominal || Number(form.nominal) <= 0) return;
    if (editTarget) {
      updatePenyaluran({
        ...editTarget,
        tanggal: form.tanggal,
        penerimaId: form.penerimaId,
        penerimaNama: form.penerimaNama,
        program: form.program,
        nominal: Number(form.nominal),
        keterangan: form.keterangan,
        status: form.status,
      });
    } else {
      addPenyaluran({
        tanggal: form.tanggal,
        penerimaId: form.penerimaId,
        penerimaNama: form.penerimaNama,
        program: form.program,
        nominal: Number(form.nominal),
        keterangan: form.keterangan,
        status: form.status,
      });
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (deleteTarget) deletePenyaluran(deleteTarget.id);
    setDeleteTarget(null);
  };

  const confirmApprove = () => {
    if (approveTarget) updatePenyaluran({ ...approveTarget, status: 'Disalurkan' });
    setApproveTarget(null);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ArrowRightLeft size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Disalurkan</p>
              <p className="text-2xl font-bold text-gray-900">{formatRupiah(totalDisalurkan)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <ArrowRightLeft size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Penyaluran</p>
              <p className="text-2xl font-bold text-gray-900">{penyaluran.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <ArrowRightLeft size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Menunggu Persetujuan</p>
              <p className="text-2xl font-bold text-gray-900">{menunggu}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-3 flex-1 max-w-xl">
          <div className="flex-1">
            <Input
              placeholder="Cari kode, penerima, atau program..."
              icon={<Search size={18} />}
              value={search}
              onChange={(e) => { setSearch(e.target.value); }}
            />
          </div>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-40">
            <option value="all">Semua Status</option>
            <option value="Disalurkan">Disalurkan</option>
            <option value="Diajukan">Diajukan</option>
            <option value="Ditolak">Ditolak</option>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => alert('Fitur export akan segera tersedia.')}>
            <Download size={16} /> Export
          </Button>
          <Button variant="primary" onClick={openAdd}>
            <Plus size={16} /> Penyaluran Dana
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
                <th className="text-left font-semibold px-5 py-3.5">Kode</th>
                <th className="text-left font-semibold px-5 py-3.5">Penerima</th>
                <th className="text-left font-semibold px-5 py-3.5">Program/Kegiatan</th>
                <th className="text-left font-semibold px-5 py-3.5">Nominal</th>
                <th className="text-left font-semibold px-5 py-3.5">Keterangan</th>
                <th className="text-left font-semibold px-5 py-3.5">Status</th>
                <th className="text-center font-semibold px-5 py-3.5">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-sm text-gray-400">
                    Tidak ada data yang cocok.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{formatTanggal(p.tanggal)}</td>
                    <td className="px-5 py-3.5 text-sm font-mono text-gray-600">{p.kode}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">{p.penerimaNama}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 max-w-[160px] truncate">{p.program}</td>
                    <td className="px-5 py-3.5 text-sm font-bold text-gray-900">{formatRupiah(p.nominal)}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 max-w-[200px] truncate" title={p.keterangan}>{p.keterangan}</td>
                    <td className="px-5 py-3.5"><Badge variant={statusVariant(p.status)}>{p.status}</Badge></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1">
                        {p.status === 'Diajukan' && (
                          <button
                            onClick={() => setApproveTarget(p)}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                            title="Setujui"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 rounded-lg text-gray-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
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
      </Card>

      {/* Modal Tambah / Edit */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? 'Edit Penyaluran Dana' : 'Tambah Penyaluran Dana'}
        subtitle={editTarget ? `Mengubah ${editTarget.kode}` : 'Catat penyaluran dana ke penerima'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!form.penerimaId || !form.program.trim() || !form.nominal || Number(form.nominal) <= 0}
            >
              <ArrowRightLeft size={16} /> {editTarget ? 'Perbarui' : 'Simpan'} Penyaluran
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
            <Input label="Kode Penyaluran" value={editTarget.kode} readOnly />
          ) : (
            <Input label="Kode Penyaluran" value="(otomatis)" readOnly className="text-gray-400 italic" />
          )}
          <Select
            label="Pilih Penerima"
            value={form.penerimaId}
            onChange={(e) => handlePenerimaChange(e.target.value)}
          >
            <option value="">-- Pilih Penerima --</option>
            {penerima.map((p) => (
              <option key={p.id} value={p.id}>{p.nama} — {p.kategori}</option>
            ))}
          </Select>
          <Input
            label="Program/Kegiatan"
            placeholder="Nama program"
            value={form.program}
            onChange={(e) => setForm((f) => ({ ...f, program: e.target.value }))}
          />
          <Input
            label="Nominal (Rp)"
            type="number"
            min="1"
            placeholder="0"
            value={form.nominal}
            onChange={(e) => setForm((f) => ({ ...f, nominal: e.target.value }))}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as PenyaluranStatus }))}
          >
            <option>Diajukan</option>
            <option>Disalurkan</option>
            <option>Ditolak</option>
          </Select>
          <div className="sm:col-span-2">
            <Input
              label="Keterangan"
              placeholder="Keterangan penyaluran..."
              value={form.keterangan}
              onChange={(e) => setForm((f) => ({ ...f, keterangan: e.target.value }))}
            />
          </div>
        </div>
      </Modal>

      {/* Modal Setujui */}
      <Modal
        open={approveTarget !== null}
        onClose={() => setApproveTarget(null)}
        title="Setujui Penyaluran"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setApproveTarget(null)}>Batal</Button>
            <Button variant="primary" onClick={confirmApprove}>
              <CheckCircle size={16} /> Ya, Setujui
            </Button>
          </>
        }
      >
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle size={28} className="text-emerald-500" />
          </div>
          <p className="text-sm text-gray-700">
            Setujui penyaluran{' '}
            <span className="font-bold text-gray-900">{approveTarget?.kode}</span> ke{' '}
            <span className="font-bold text-gray-900">{approveTarget?.penerimaNama}</span>?
          </p>
          <p className="text-xs text-gray-400">Status akan diubah menjadi <strong>Disalurkan</strong>.</p>
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
            Yakin ingin menghapus{' '}
            <span className="font-bold text-gray-900">{deleteTarget?.kode}</span>?
          </p>
          <p className="text-xs text-gray-400">Tindakan ini tidak dapat dibatalkan.</p>
        </div>
      </Modal>
    </div>
  );
}
