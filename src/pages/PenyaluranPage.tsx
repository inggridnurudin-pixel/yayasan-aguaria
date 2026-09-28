import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { penyaluranData, penerimaData } from '@/data/dummyData';
import { formatRupiah, formatTanggal } from '@/utils/format';
import { Plus, Search, Pencil, Trash2, ArrowRightLeft, Download } from 'lucide-react';

export function PenyaluranPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = useMemo(() => {
    return penyaluranData.filter((p) => {
      const matchSearch =
        p.kode.toLowerCase().includes(search.toLowerCase()) ||
        p.penerimaNama.toLowerCase().includes(search.toLowerCase()) ||
        p.program.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || p.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [search, filterStatus]);

  const totalDisalurkan = penyaluranData.filter((p) => p.status === 'Disalurkan').reduce((s, p) => s + p.nominal, 0);

  return (
    <div className="space-y-5 animate-fade-in">
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
              <p className="text-2xl font-bold text-gray-900">{penyaluranData.length}</p>
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
              <p className="text-2xl font-bold text-gray-900">{penyaluranData.filter((p) => p.status === 'Diajukan').length}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-3 flex-1 max-w-xl">
          <div className="flex-1">
            <Input
              placeholder="Cari kode, penerima, atau program..."
              icon={<Search size={18} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
          <Button variant="outline"><Download size={16} /> Export</Button>
          <Button variant="primary" onClick={() => setModalOpen(true)}><Plus size={16} /> Penyaluran Dana</Button>
        </div>
      </div>

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
                <th className="text-center font-semibold px-5 py-3.5">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
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
        title="Tambah Penyaluran Dana"
        subtitle="Catat penyaluran dana ke penerima"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}><ArrowRightLeft size={16} /> Simpan Penyaluran</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Tanggal" type="date" defaultValue="2026-09-28" />
          <Input label="Kode Penyaluran" defaultValue="PNY-2609-011" readOnly />
          <Select label="Pilih Penerima">
            {penerimaData.map((p) => (
              <option key={p.id} value={p.id}>{p.nama} — {p.kategori}</option>
            ))}
          </Select>
          <Input label="Program/Kegiatan" placeholder="Nama program" />
          <Input label="Nominal (Rp)" type="number" placeholder="0" />
          <Select label="Status">
            <option value="Diajukan">Diajukan</option>
            <option value="Disalurkan">Disalurkan</option>
            <option value="Ditolak">Ditolak</option>
          </Select>
          <div className="sm:col-span-2">
            <Input label="Keterangan" placeholder="Keterangan penyaluran..." />
          </div>
        </div>
      </Modal>
    </div>
  );
}
