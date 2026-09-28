import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { penerimaData } from '@/data/dummyData';
import { formatRupiah } from '@/utils/format';
import { Plus, Search, Pencil, Trash2, UserCheck, Phone, MapPin, Download, Building2, Home, School, Users } from 'lucide-react';

const kategoriIcon: Record<string, typeof Building2> = {
  'Individu': Home,
  'Lembaga': Building2,
  'Panti Asuhan': Home,
  'Sekolah': School,
  'Masjid': Building2,
};

const kategoriColor: Record<string, string> = {
  'Individu': 'bg-sky-50 text-sky-600',
  'Lembaga': 'bg-brand-50 text-brand-600',
  'Panti Asuhan': 'bg-amber-50 text-amber-600',
  'Sekolah': 'bg-emerald-50 text-emerald-600',
  'Masjid': 'bg-violet-50 text-violet-600',
};

export function PenerimaPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterKategori, setFilterKategori] = useState('all');

  const filtered = useMemo(() => {
    return penerimaData.filter((p) => {
      const matchSearch =
        p.nama.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase());
      const matchKategori = filterKategori === 'all' || p.kategori === filterKategori;
      return matchSearch && matchKategori;
    });
  }, [search, filterKategori]);

  return (
    <div className="space-y-5 animate-fade-in">
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
            <option value="Individu">Individu</option>
            <option value="Lembaga">Lembaga</option>
            <option value="Panti Asuhan">Panti Asuhan</option>
            <option value="Sekolah">Sekolah</option>
            <option value="Masjid">Masjid</option>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download size={16} /> Export</Button>
          <Button variant="primary" onClick={() => setModalOpen(true)}><Plus size={16} /> Tambah Penerima</Button>
        </div>
      </div>

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
                <Button variant="secondary" size="sm" className="flex-1"><Pencil size={14} /> Edit</Button>
                <Button variant="outline" size="sm"><Trash2 size={14} /></Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Tambah Penerima Dana"
        subtitle="Daftarkan penerima manfaat baru"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}><UserCheck size={16} /> Simpan Penerima</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="ID Penerima" defaultValue="PEN-009" readOnly />
          <Input label="Nama Penerima" placeholder="Nama lengkap/lembaga" />
          <Select label="Kategori">
            <option value="Individu">Individu</option>
            <option value="Lembaga">Lembaga</option>
            <option value="Panti Asuhan">Panti Asuhan</option>
            <option value="Sekolah">Sekolah</option>
            <option value="Masjid">Masjid</option>
          </Select>
          <Input label="Kontak Person" placeholder="Nama kontak" />
          <Input label="Nomor Telepon" placeholder="0xx-xxx-xxxx" icon={<Phone size={16} />} />
          <div className="sm:col-span-2">
            <Input label="Alamat" placeholder="Alamat lengkap" icon={<MapPin size={16} />} />
          </div>
          <Select label="Status">
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </Select>
        </div>
      </Modal>
    </div>
  );
}
