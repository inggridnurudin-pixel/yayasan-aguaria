import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { donaturData } from '@/data/dummyData';
import { formatRupiah, formatTanggal } from '@/utils/format';
import { Plus, Search, Pencil, Trash2, Users, Mail, Phone, MapPin, Download } from 'lucide-react';

export function DonaturPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return donaturData.filter(
      (d) =>
        d.nama.toLowerCase().includes(search.toLowerCase()) ||
        d.id.toLowerCase().includes(search.toLowerCase()) ||
        d.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const totalDonasi = donaturData.reduce((s, d) => s + d.totalDonasi, 0);
  const donaturAktif = donaturData.filter((d) => d.status === 'Aktif').length;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Users size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Donatur</p>
              <p className="text-2xl font-bold text-gray-900">{donaturData.length}</p>
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
          <Button variant="outline"><Download size={16} /> Export</Button>
          <Button variant="primary" onClick={() => setModalOpen(true)}><Plus size={16} /> Tambah Donatur</Button>
        </div>
      </div>

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
                <th className="text-center font-semibold px-5 py-3.5">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
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
                      <p className="text-sm text-gray-600 flex items-center gap-1.5"><Phone size={12} /> {d.telepon}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1.5"><Mail size={12} /> {d.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-bold text-gray-900">{formatRupiah(d.totalDonasi)}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{formatTanggal(d.bergabung)}</td>
                  <td className="px-5 py-3.5"><Badge variant={statusVariant(d.status)}>{d.status}</Badge></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1.5 rounded-lg text-gray-400 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                        <Pencil size={16} />
                      </button>
                      <button className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Tambah Donatur"
        subtitle="Daftarkan donatur baru"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}><Users size={16} /> Simpan Donatur</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="ID Donatur" defaultValue="DON-011" readOnly />
          <Input label="Nama Lengkap" placeholder="Nama donatur" />
          <Input label="Nomor Telepon" placeholder="08xx-xxxx-xxxx" icon={<Phone size={16} />} />
          <Input label="Email" type="email" placeholder="email@contoh.com" icon={<Mail size={16} />} />
          <div className="sm:col-span-2">
            <Input label="Alamat" placeholder="Alamat lengkap" icon={<MapPin size={16} />} />
          </div>
          <div className="sm:col-span-2">
            <Input label="Catatan (Opsional)" placeholder="Tambah catatan..." />
          </div>
        </div>
      </Modal>
    </div>
  );
}
