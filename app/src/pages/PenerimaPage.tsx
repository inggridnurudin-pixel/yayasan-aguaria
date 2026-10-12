import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { useApp } from '@/context/AppContext';
import { formatRupiah } from '@/utils/format';
import type { Penerima, PenerimaKategori, PenerimaStatus } from '@/types';
import {
  Plus, Search, Pencil, Trash2, UserCheck,
  Phone, MapPin, Download, Building2, Home, School, AlertTriangle,
} from 'lucide-react';

const kategoriIcon: Record<string, typeof Building2> = {
  Individu: Home,
  Lembaga: Building2,
  'Panti Asuhan': Home,
  Sekolah: School,
  Masjid: Building2,
};

const kategoriColor: Record<string, string> = {
  Individu: 'bg-sky-50 text-sky-600',
  Lembaga: 'bg-brand-50 text-brand-600',
  'Panti Asuhan': 'bg-amber-50 text-amber-600',
  Sekolah: 'bg-emerald-50 text-emerald-600',
  Masjid: 'bg-violet-50 text-violet-600',
};

const emptyForm = {
  nama: '',
  kategori: 'Lembaga' as PenerimaKategori,
  kontakPerson: '',
  telepon: '',
  alamat: '',
  status: 'Aktif' as PenerimaStatus,
};

export function PenerimaPage() {
  const { penerima, addPenerima, updatePenerima, deletePenerima } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Penerima | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Penerima | null>(null);
  const [search, setSearch] = useState('');
  const [filterKategori, setFilterKategori] = useState('all');
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<typeof emptyForm>>({});

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return penerima.filter((p) => {
      const matchSearch = p.nama.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
      const matchKategori = filterKategori === 'all' || p.kategori === filterKategori;
      return matchSearch && matchKategori;
    });
  }, [penerima, search, filterKategori]);

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (p: Penerima) => {
    setEditTarget(p);
    setForm({
      nama: p.nama,
      kategori: p.kategori,
      kontakPerson: p.kontakPerson,
      telepon: p.telepon,
      alamat: p.alamat,
      status: p.status,
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const e: Partial<typeof emptyForm> = {};
    if (!form.nama.trim()) e.nama = 'Nama wajib diisi';
    if (!form.telepon.trim()) e.telepon = 'Telepon wajib diisi';
    if (!form.alamat.trim()) e.alamat = 'Alamat wajib diisi';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editTarget) {
      updatePenerima({ ...editTarget, ...form });
    } else {
      addPenerima(form);
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (deleteTarget) deletePenerima(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-3 flex-1 max-w-xl">
          <div className="flex-1">
            <Input
              placeholder="Cari nama atau ID penerima..."
              icon={<Search size={18} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)} className="w-40">
            <option value="all">Semua Kategori</option>
            <option>Individu</option>
            <option>Lembaga</option>
            <option>Panti Asuhan</option>
            <option>Sekolah</option>
            <option>Masjid</option>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => alert('Fitur export akan segera tersedia.')}>
            <Download size={16} /> Export
          </Button>
          <Button variant="primary" onClick={openAdd}>
            <Plus size={16} /> Tambah Penerima
          </Button>
        </div>
      </div>

      {/* Grid kartu */}
      {filtered.length === 0 ? (
        <Card className="p-12 text-center text-sm text-gray-400">
          Tidak ada penerima yang cocok dengan pencarian.
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => {
            const Icon = kategoriIcon[p.kategori] || Building2;
            return (
              <Card key={p.id} hover className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kategoriColor[p.kategori]}`}>
                    <Icon size={24} />
                  </div>
                  <Badge variant={statusVariant(p.status)}>{p.status}</Badge>
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{p.nama}</h3>
                <p className="text-xs text-gray-500 mb-3">{p.id} · {p.kategori}</p>
                <div className="space-y-1.5 mb-4">
                  <p className="text-sm text-gray-600 flex items-start gap-2">
                    <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
                    <span className="truncate">{p.alamat}</span>
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Phone size={14} className="text-gray-400 shrink-0" />
                    {p.telepon}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <UserCheck size={14} className="text-gray-400 shrink-0" />
                    {p.kontakPerson}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Total Diterima</p>
                    <p className="text-sm font-bold text-gray-900">{formatRupiah(p.totalDiterima)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Penyaluran</p>
                    <p className="text-sm font-bold text-gray-900">{p.jumlahPenyaluran}x</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="secondary" size="sm" className="flex-1" onClick={() => openEdit(p)}>
                    <Pencil size={14} /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setDeleteTarget(p)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal Tambah / Edit */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? 'Edit Penerima Dana' : 'Tambah Penerima Dana'}
        subtitle={editTarget ? `Mengubah data ${editTarget.nama}` : 'Daftarkan penerima manfaat baru'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button variant="primary" onClick={handleSave}>
              <UserCheck size={16} /> {editTarget ? 'Perbarui' : 'Simpan'} Penerima
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {editTarget && <Input label="ID Penerima" value={editTarget.id} readOnly />}
          <div className={editTarget ? '' : 'sm:col-span-2'}>
            <Input
              label="Nama Penerima / Lembaga"
              placeholder="Nama lengkap"
              value={form.nama}
              onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
              className={errors.nama ? 'border-red-400' : ''}
            />
            {errors.nama && <p className="text-xs text-red-500 mt-1">{errors.nama}</p>}
          </div>
          <Select
            label="Kategori"
            value={form.kategori}
            onChange={(e) => setForm((f) => ({ ...f, kategori: e.target.value as PenerimaKategori }))}
          >
            <option>Individu</option>
            <option>Lembaga</option>
            <option>Panti Asuhan</option>
            <option>Sekolah</option>
            <option>Masjid</option>
          </Select>
          <Input
            label="Kontak Person"
            placeholder="Nama kontak"
            value={form.kontakPerson}
            onChange={(e) => setForm((f) => ({ ...f, kontakPerson: e.target.value }))}
          />
          <Input
            label="Nomor Telepon"
            placeholder="0xx-xxx-xxxx"
            icon={<Phone size={16} />}
            value={form.telepon}
            onChange={(e) => setForm((f) => ({ ...f, telepon: e.target.value }))}
            className={errors.telepon ? 'border-red-400' : ''}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as PenerimaStatus }))}
          >
            <option>Aktif</option>
            <option>Nonaktif</option>
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
            {errors.alamat && <p className="text-xs text-red-500 mt-1">{errors.alamat}</p>}
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
            Yakin ingin menghapus penerima{' '}
            <span className="font-bold text-gray-900">{deleteTarget?.nama}</span>?
          </p>
          <p className="text-xs text-gray-400">Tindakan ini tidak dapat dibatalkan.</p>
        </div>
      </Modal>
    </div>
  );
}
