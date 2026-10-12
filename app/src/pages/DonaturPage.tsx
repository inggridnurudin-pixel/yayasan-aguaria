import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { useApp } from '@/context/AppContext';
import { formatRupiah, formatTanggal } from '@/utils/format';
import type { Donatur, DonaturStatus } from '@/types';
import { Plus, Search, Pencil, Trash2, Users, Mail, Phone, MapPin, Download, AlertTriangle } from 'lucide-react';

const emptyForm = {
  nama: '',
  telepon: '',
  email: '',
  alamat: '',
  status: 'Aktif' as DonaturStatus,
};

export function DonaturPage() {
  const { donatur, addDonatur, updateDonatur, deleteDonatur } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Donatur | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Donatur | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<typeof emptyForm>>({});

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return donatur.filter(
      (d) =>
        d.nama.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q) ||
        d.email.toLowerCase().includes(q)
    );
  }, [donatur, search]);

  const totalDonasi = donatur.reduce((s, d) => s + d.totalDonasi, 0);
  const donaturAktif = donatur.filter((d) => d.status === 'Aktif').length;

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (d: Donatur) => {
    setEditTarget(d);
    setForm({ nama: d.nama, telepon: d.telepon, email: d.email, alamat: d.alamat, status: d.status });
    setErrors({});
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const e: Partial<typeof emptyForm> = {};
    if (!form.nama.trim()) e.nama = 'Nama wajib diisi';
    if (!form.telepon.trim()) e.telepon = 'Telepon wajib diisi';
    if (!form.email.trim()) e.email = 'Email wajib diisi';
    if (!form.alamat.trim()) e.alamat = 'Alamat wajib diisi';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editTarget) {
      updateDonatur({ ...editTarget, ...form });
    } else {
      addDonatur(form);
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (deleteTarget) deleteDonatur(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Users size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Donatur</p>
              <p className="text-2xl font-bold text-gray-900">{donatur.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Donatur Aktif</p>
              <p className="text-2xl font-bold text-gray-900">{donaturAktif}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Donasi Kumulatif</p>
              <p className="text-2xl font-bold text-gray-900">{formatRupiah(totalDonasi)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Cari nama, ID, atau email donatur..."
            icon={<Search size={18} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => alert('Fitur export akan segera tersedia.')}>
            <Download size={16} /> Export
          </Button>
          <Button variant="primary" onClick={openAdd}>
            <Plus size={16} /> Tambah Donatur
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50/50">
                <th className="text-left font-semibold px-5 py-3.5">ID Donatur</th>
                <th className="text-left font-semibold px-5 py-3.5">Nama</th>
                <th className="text-left font-semibold px-5 py-3.5">Kontak</th>
                <th className="text-left font-semibold px-5 py-3.5">Total Donasi</th>
                <th className="text-left font-semibold px-5 py-3.5">Bergabung</th>
                <th className="text-left font-semibold px-5 py-3.5">Status</th>
                <th className="text-center font-semibold px-5 py-3.5">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-sm text-gray-400">
                    Tidak ada data donatur yang cocok.
                  </td>
                </tr>
              ) : (
                filtered.map((d) => (
                  <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-mono text-gray-600">{d.id}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {d.nama.split(' ').slice(0, 2).map((w) => w[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{d.nama}</p>
                          <p className="text-xs text-gray-500">{d.jumlahDonasi} donasi</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="space-y-0.5">
                        <p className="text-sm text-gray-600 flex items-center gap-1.5"><Phone size={12} />{d.telepon}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1.5"><Mail size={12} />{d.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-bold text-gray-900">{formatRupiah(d.totalDonasi)}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{formatTanggal(d.bergabung)}</td>
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
      </Card>

      {/* Modal Tambah / Edit */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? 'Edit Donatur' : 'Tambah Donatur'}
        subtitle={editTarget ? `Mengubah data ${editTarget.nama}` : 'Daftarkan donatur baru'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button variant="primary" onClick={handleSave}>
              <Users size={16} /> {editTarget ? 'Perbarui' : 'Simpan'} Donatur
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {editTarget && <Input label="ID Donatur" value={editTarget.id} readOnly />}
          <Input
            label="Nama Lengkap"
            placeholder="Nama donatur"
            value={form.nama}
            onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
            className={errors.nama ? 'border-red-400' : ''}
          />
          {errors.nama && <p className="text-xs text-red-500 -mt-2">{errors.nama}</p>}
          <Input
            label="Nomor Telepon"
            placeholder="08xx-xxxx-xxxx"
            icon={<Phone size={16} />}
            value={form.telepon}
            onChange={(e) => setForm((f) => ({ ...f, telepon: e.target.value }))}
            className={errors.telepon ? 'border-red-400' : ''}
          />
          <Input
            label="Email"
            type="email"
            placeholder="email@contoh.com"
            icon={<Mail size={16} />}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className={errors.email ? 'border-red-400' : ''}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as DonaturStatus }))}
          >
            <option>Aktif</option>
            <option>Tidak Aktif</option>
          </Select>
          <div className="sm:col-span-2">
            <Input
              label="Alamat"
              placeholder="Alamat lengkap"
              icon={<MapPin size={16} />}
              value={form.alamat}
              onChange={(e) => setForm((f) => ({ ...f, alamat: e.target.value }))}
              className={errors.alamat ? 'border-red-400' : ''}
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
            Yakin ingin menghapus donatur{' '}
            <span className="font-bold text-gray-900">{deleteTarget?.nama}</span>?
          </p>
          <p className="text-xs text-gray-400">Tindakan ini tidak dapat dibatalkan.</p>
        </div>
      </Modal>
    </div>
  );
}
