import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { donasiData, donaturData } from '@/data/dummyData';
import { formatRupiah, formatTanggal } from '@/utils/format';
import { Plus, Search, Pencil, Trash2, HandHeart, Filter, Download } from 'lucide-react';

export function DonasiPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = useMemo(() => {
    return donasiData.filter((d) => {
      const matchSearch =
        d.kode.toLowerCase().includes(search.toLowerCase()) ||
        d.donaturNama.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || d.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [search, filterStatus]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-3 flex-1 max-w-xl">
          <div className="flex-1">
            <Input
              placeholder="Cari kode atau nama donatur..."
              icon={<Search size={18} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-40">
            <option value="all">Semua Status</option>
            <option value="Lunas">Lunas</option>
            <option value="Pending">Pending</option>
            <option value="Gagal">Gagal</option>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="md"><Download size={16} /> Export</Button>
          <Button variant="primary" size="md" onClick={() => setModalOpen(true)}><Plus size={16} /> Tambah Donasi</Button>
        </div>
      </div>

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
                <th className="text-center font-semibold px-5 py-3.5">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
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
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">Menampilkan {filtered.length} dari {donasiData.length} transaksi</p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled>Sebelumnya</Button>
            <Button variant="outline" size="sm">1</Button>
            <Button variant="primary" size="sm">2</Button>
            <Button variant="outline" size="sm">Selanjutnya</Button>
          </div>
        </div>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Tambah Donasi"
        subtitle="Catat donasi baru dari donatur"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}><HandHeart size={16} /> Simpan Donasi</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Tanggal" type="date" defaultValue="2026-09-28" />
          <Input label="Kode Donasi" defaultValue="DNS-2609-016" readOnly />
          <Select label="Pilih Donatur">
            {donaturData.map((d) => (
              <option key={d.id} value={d.id}>{d.nama}</option>
            ))}
          </Select>
          <Select label="Jenis Donasi">
            <option value="Tunai">Tunai</option>
            <option value="Barang">Barang</option>
            <option value="Wakaf">Wakaf</option>
            <option value="Zakat">Zakat</option>
            <option value="Infaq">Infaq</option>
          </Select>
          <Input label="Nominal (Rp)" type="number" placeholder="0" />
          <Select label="Metode Pembayaran">
            <option value="Transfer Bank">Transfer Bank</option>
            <option value="Tunai">Tunai</option>
            <option value="E-Wallet">E-Wallet</option>
            <option value="QRIS">QRIS</option>
            <option value="Cek">Cek</option>
          </Select>
          <Select label="Status">
            <option value="Lunas">Lunas</option>
            <option value="Pending">Pending</option>
            <option value="Gagal">Gagal</option>
          </Select>
          <div className="sm:col-span-2">
            <Input label="Catatan (Opsional)" placeholder="Tambah catatan untuk donasi ini..." />
          </div>
        </div>
      </Modal>
    </div>
  );
}
