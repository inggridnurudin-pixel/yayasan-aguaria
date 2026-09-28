import { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { AreaChart } from '@/components/charts/AreaChart';
import { donasiData, penyaluranData, chartDonasiBulanan, chartPenyaluranBulanan } from '@/data/dummyData';
import { formatRupiah, formatTanggal } from '@/utils/format';
import { FileText, Download, Calendar, TrendingUp, TrendingDown, Wallet, FileSpreadsheet, Printer } from 'lucide-react';

type ReportTab = 'penerimaan' | 'penyaluran' | 'arusdana' | 'saldo';

const tabs: { key: ReportTab; label: string; icon: typeof FileText }[] = [
  { key: 'penerimaan', label: 'Penerimaan Donasi', icon: TrendingUp },
  { key: 'penyaluran', label: 'Penyaluran Dana', icon: TrendingDown },
  { key: 'arusdana', label: 'Arus Dana', icon: TrendingUp },
  { key: 'saldo', label: 'Ringkasan Saldo', icon: Wallet },
];

export function LaporanPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>('penerimaan');

  const totalDonasi = donasiData.filter((d) => d.status === 'Lunas').reduce((s, d) => s + d.nominal, 0);
  const totalPenyaluran = penyaluranData.filter((p) => p.status === 'Disalurkan').reduce((s, p) => s + p.nominal, 0);
  const saldo = totalDonasi - totalPenyaluran;

  return (
    <div className="space-y-5 animate-fade-in">
      <Card className="p-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Filter Periode Laporan</h3>
            <p className="text-sm text-gray-500">Pilih rentang tanggal untuk laporan</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <Input label="Dari Tanggal" type="date" defaultValue="2026-09-01" />
            <Input label="Sampai Tanggal" type="date" defaultValue="2026-09-30" />
            <Select label="Jenis Laporan">
              <option value="semua">Semua Laporan</option>
              <option value="penerimaan">Penerimaan Donasi</option>
              <option value="penyaluran">Penyaluran Dana</option>
              <option value="arusdana">Arus Dana</option>
            </Select>
            <div className="flex gap-2">
              <Button variant="outline"><FileSpreadsheet size={16} /> Export Excel</Button>
              <Button variant="primary"><Download size={16} /> Export PDF</Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'penerimaan' && (
        <Card>
          <CardHeader title="Laporan Penerimaan Donasi" subtitle="Periode: 1 - 30 September 2026" icon={<TrendingUp size={18} />} action={<Button variant="ghost" size="sm"><Printer size={16} /> Cetak</Button>} />
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-brand-50 rounded-lg p-4">
                <p className="text-sm text-brand-600">Total Penerimaan</p>
                <p className="text-xl font-bold text-brand-900 mt-1">{formatRupiah(totalDonasi)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Jumlah Transaksi</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{donasiData.filter((d) => d.status === 'Lunas').length}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Rata-rata per Transaksi</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{formatRupiah(Math.round(totalDonasi / donasiData.filter((d) => d.status === 'Lunas').length))}</p>
              </div>
            </div>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left font-semibold px-4 py-3">Tanggal</th>
                    <th className="text-left font-semibold px-4 py-3">Kode</th>
                    <th className="text-left font-semibold px-4 py-3">Donatur</th>
                    <th className="text-left font-semibold px-4 py-3">Jenis</th>
                    <th className="text-right font-semibold px-4 py-3">Nominal</th>
                    <th className="text-left font-semibold px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {donasiData.filter((d) => d.status === 'Lunas').map((d) => (
                    <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-sm text-gray-600">{formatTanggal(d.tanggal)}</td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">{d.kode}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{d.donaturNama}</td>
                      <td className="px-4 py-3"><Badge variant="info">{d.jenis}</Badge></td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">{formatRupiah(d.nominal)}</td>
                      <td className="px-4 py-3"><Badge variant={statusVariant(d.status)}>{d.status}</Badge></td>
                    </tr>
                  ))}
                  <tr className="bg-brand-50/50 font-bold">
                    <td colSpan={4} className="px-4 py-3.5 text-sm text-brand-900">Total Penerimaan</td>
                    <td className="px-4 py-3.5 text-sm text-brand-900 text-right">{formatRupiah(totalDonasi)}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'penyaluran' && (
        <Card>
          <CardHeader title="Laporan Penyaluran Dana" subtitle="Periode: 1 - 30 September 2026" icon={<TrendingDown size={18} />} action={<Button variant="ghost" size="sm"><Printer size={16} /> Cetak</Button>} />
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-amber-50 rounded-lg p-4">
                <p className="text-sm text-amber-600">Total Penyaluran</p>
                <p className="text-xl font-bold text-amber-900 mt-1">{formatRupiah(totalPenyaluran)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Jumlah Penyaluran</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{penyaluranData.filter((p) => p.status === 'Disalurkan').length}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Penerima Manfaat</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{new Set(penyaluranData.filter((p) => p.status === 'Disalurkan').map((p) => p.penerimaId)).size}</p>
              </div>
            </div>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left font-semibold px-4 py-3">Tanggal</th>
                    <th className="text-left font-semibold px-4 py-3">Kode</th>
                    <th className="text-left font-semibold px-4 py-3">Penerima</th>
                    <th className="text-left font-semibold px-4 py-3">Program</th>
                    <th className="text-right font-semibold px-4 py-3">Nominal</th>
                    <th className="text-left font-semibold px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {penyaluranData.filter((p) => p.status === 'Disalurkan').map((p) => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-sm text-gray-600">{formatTanggal(p.tanggal)}</td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">{p.kode}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{p.penerimaNama}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.program}</td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">{formatRupiah(p.nominal)}</td>
                      <td className="px-4 py-3"><Badge variant={statusVariant(p.status)}>{p.status}</Badge></td>
                    </tr>
                  ))}
                  <tr className="bg-amber-50/50 font-bold">
                    <td colSpan={4} className="px-4 py-3.5 text-sm text-amber-900">Total Penyaluran</td>
                    <td className="px-4 py-3.5 text-sm text-amber-900 text-right">{formatRupiah(totalPenyaluran)}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'arusdana' && (
        <div className="space-y-5">
          <Card>
            <CardHeader title="Laporan Arus Dana" subtitle="Pemasukan vs Pengeluaran 6 bulan terakhir" icon={<TrendingUp size={18} />} />
            <div className="p-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-brand-500" /> Pemasukan Donasi
                  </h4>
                  <AreaChart data={chartDonasiBulanan.map((d) => ({ label: d.bulan, value: d.nilai }))} color="#2563eb" height={200} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500" /> Penyaluran Dana
                  </h4>
                  <AreaChart data={chartPenyaluranBulanan.map((d) => ({ label: d.bulan, value: d.nilai }))} color="#f59e0b" height={200} />
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="p-5">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-500 border-b border-gray-100">
                    <th className="text-left font-semibold px-4 py-3">Bulan</th>
                    <th className="text-right font-semibold px-4 py-3">Pemasukan</th>
                    <th className="text-right font-semibold px-4 py-3">Pengeluaran</th>
                    <th className="text-right font-semibold px-4 py-3">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {chartDonasiBulanan.map((d, i) => {
                    const keluar = chartPenyaluranBulanan[i].nilai;
                    const net = d.nilai - keluar;
                    return (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">{d.bulan}</td>
                        <td className="px-4 py-3 text-sm text-right text-emerald-600 font-semibold">{formatRupiah(d.nilai)}</td>
                        <td className="px-4 py-3 text-sm text-right text-red-600 font-semibold">-{formatRupiah(keluar)}</td>
                        <td className={`px-4 py-3 text-sm text-right font-bold ${net >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{net >= 0 ? '+' : ''}{formatRupiah(net)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'saldo' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-5 bg-gradient-to-br from-brand-600 to-brand-700 text-white border-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                  <TrendingUp size={22} />
                </div>
                <p className="text-sm text-brand-100">Total Pemasukan</p>
              </div>
              <p className="text-2xl font-bold">{formatRupiah(totalDonasi)}</p>
            </Card>
            <Card className="p-5 bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                  <TrendingDown size={22} />
                </div>
                <p className="text-sm text-amber-100">Total Pengeluaran</p>
              </div>
              <p className="text-2xl font-bold">{formatRupiah(totalPenyaluran)}</p>
            </Card>
            <Card className="p-5 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                  <Wallet size={22} />
                </div>
                <p className="text-sm text-emerald-100">Saldo Akhir</p>
              </div>
              <p className="text-2xl font-bold">{formatRupiah(saldo)}</p>
            </Card>
          </div>
          <Card>
            <CardHeader title="Ringkasan Saldo" subtitle="Periode: 1 - 30 September 2026" icon={<Wallet size={18} />} />
            <div className="p-5">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-500 border-b border-gray-100">
                    <th className="text-left font-semibold px-4 py-3">Keterangan</th>
                    <th className="text-right font-semibold px-4 py-3">Debit</th>
                    <th className="text-right font-semibold px-4 py-3">Kredit</th>
                    <th className="text-right font-semibold px-4 py-3">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-50">
                    <td className="px-4 py-3.5 text-sm font-semibold text-gray-900">Saldo Awal Periode</td>
                    <td className="px-4 py-3.5 text-sm text-right text-gray-400">—</td>
                    <td className="px-4 py-3.5 text-sm text-right text-gray-400">—</td>
                    <td className="px-4 py-3.5 text-sm text-right font-bold text-gray-900">{formatRupiah(0)}</td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="px-4 py-3.5 text-sm text-gray-700">Penerimaan Donasi</td>
                    <td className="px-4 py-3.5 text-sm text-right font-semibold text-emerald-600">{formatRupiah(totalDonasi)}</td>
                    <td className="px-4 py-3.5 text-sm text-right text-gray-400">—</td>
                    <td className="px-4 py-3.5 text-sm text-right font-bold text-gray-900">{formatRupiah(totalDonasi)}</td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="px-4 py-3.5 text-sm text-gray-700">Penyaluran Dana</td>
                    <td className="px-4 py-3.5 text-sm text-right text-gray-400">—</td>
                    <td className="px-4 py-3.5 text-sm text-right font-semibold text-red-600">{formatRupiah(totalPenyaluran)}</td>
                    <td className="px-4 py-3.5 text-sm text-right font-bold text-gray-900">{formatRupiah(saldo)}</td>
                  </tr>
                  <tr className="bg-brand-50/50 font-bold">
                    <td className="px-4 py-3.5 text-sm text-brand-900">Saldo Akhir Periode</td>
                    <td colSpan={2} className="px-4 py-3.5"></td>
                    <td className="px-4 py-3.5 text-sm text-right text-brand-900">{formatRupiah(saldo)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
