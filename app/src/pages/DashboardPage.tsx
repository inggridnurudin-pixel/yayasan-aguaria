import { type PageKey } from '@/types';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { AreaChart } from '@/components/charts/AreaChart';
import { BarChart } from '@/components/charts/BarChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { useApp } from '@/context/AppContext';
import { chartDonasiBulanan, chartPenyaluranBulanan } from '@/data/dummyData';
import { formatRupiah, formatRupiahShort, formatTanggal } from '@/utils/format';
import {
  TrendingUp, TrendingDown, Wallet, Users, HandHeart,
  ArrowRightLeft, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (page: PageKey) => void;
}

const colorMap: Record<string, string> = {
  brand: 'bg-brand-50 text-brand-600',
  amber: 'bg-amber-50 text-amber-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  sky: 'bg-sky-50 text-sky-600',
};

/* Warna tetap per jenis donasi untuk DonutChart */
const DONUT_COLORS: Record<string, string> = {
  Tunai: '#2563eb',
  Zakat: '#f59e0b',
  Infaq: '#10b981',
  Wakaf: '#8b5cf6',
  Barang: '#64748b',
};

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { donasi, penyaluran, donatur } = useApp();

  const lunasDonasi = donasi.filter((d) => d.status === 'Lunas');
  const disalurkanPenyaluran = penyaluran.filter((p) => p.status === 'Disalurkan');

  const totalDonasi = lunasDonasi.reduce((s, d) => s + d.nominal, 0);
  const totalPenyaluran = disalurkanPenyaluran.reduce((s, p) => s + p.nominal, 0);
  const saldoDana = totalDonasi - totalPenyaluran;

  /* ── DonutChart — komposisi donasi dari data nyata ── */
  const donutData = (() => {
    const totals: Record<string, number> = {};
    lunasDonasi.forEach((d) => {
      totals[d.jenis] = (totals[d.jenis] ?? 0) + d.nominal;
    });
    const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(totals).map(([label, value]) => ({
      label,
      value: Math.round((value / grandTotal) * 100),
      color: DONUT_COLORS[label] ?? '#94a3b8',
    }));
  })();

  const stats = [
    { label: 'Total Donasi', value: formatRupiah(totalDonasi), change: '+12.5%', trend: 'up', icon: HandHeart, color: 'brand' },
    { label: 'Total Penyaluran Dana', value: formatRupiah(totalPenyaluran), change: '+8.2%', trend: 'up', icon: ArrowRightLeft, color: 'amber' },
    { label: 'Saldo Dana', value: formatRupiah(saldoDana), change: '+15.3%', trend: 'up', icon: Wallet, color: 'emerald' },
    { label: 'Jumlah Donatur', value: String(donatur.length), change: '+2', trend: 'up', icon: Users, color: 'sky' },
  ];

  const donasiTerbaru = donasi.slice(0, 5);
  const penyaluranTerbaru = penyaluran.slice(0, 5);

  // Suppress unused import warning
  void formatRupiahShort;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} hover className="p-5">
              <div className="flex items-start justify-between">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorMap[stat.color]}`}>
                  <Icon size={22} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.change}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            title="Grafik Pemasukan Donasi"
            subtitle="6 bulan terakhir"
            icon={<TrendingUp size={18} />}
            action={<Badge variant="success" size="sm"><TrendingUp size={12} /> +18.2%</Badge>}
          />
          <div className="p-5">
            <AreaChart
              data={chartDonasiBulanan.map((d) => ({ label: d.bulan, value: d.nilai }))}
              color="#2563eb"
              height={220}
            />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Grafik Penyaluran Dana"
            subtitle="6 bulan terakhir"
            icon={<TrendingDown size={18} />}
            action={<Badge variant="warning" size="sm"><TrendingDown size={12} /> +10.5%</Badge>}
          />
          <div className="p-5">
            <BarChart
              data={chartPenyaluranBulanan.map((d) => ({ label: d.bulan, value: d.nilai }))}
              color="#f59e0b"
              height={220}
            />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut - data nyata */}
        <Card className="lg:col-span-1">
          <CardHeader title="Komposisi Donasi" subtitle="Berdasarkan jenis" icon={<HandHeart size={18} />} />
          <div className="p-5 flex justify-center">
            {donutData.length > 0 ? (
              <DonutChart
                data={donutData}
                centerValue={`${donasi.filter((d) => d.status === 'Lunas').length}`}
                centerLabel="Transaksi"
              />
            ) : (
              <p className="text-sm text-gray-400 py-10">Belum ada data donasi</p>
            )}
          </div>
        </Card>

        {/* Tabel donasi terbaru */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Transaksi Donasi Terbaru"
            subtitle="5 transaksi terakhir"
            icon={<HandHeart size={18} />}
            action={
              <button
                onClick={() => onNavigate('donasi')}
                className="text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                Lihat Semua
              </button>
            }
          />
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-100">
                  <th className="text-left font-semibold px-5 py-3">Tanggal</th>
                  <th className="text-left font-semibold px-5 py-3">Donatur</th>
                  <th className="text-left font-semibold px-5 py-3">Nominal</th>
                  <th className="text-left font-semibold px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {donasiTerbaru.map((d) => (
                  <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3 text-sm text-gray-600">{formatTanggal(d.tanggal)}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-gray-900 truncate max-w-[160px]">{d.donaturNama}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-gray-900">{formatRupiah(d.nominal)}</td>
                    <td className="px-5 py-3"><Badge variant={statusVariant(d.status)}>{d.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Penyaluran terbaru */}
      <Card>
        <CardHeader
          title="Penyaluran Dana Terbaru"
          subtitle="5 penyaluran terakhir"
          icon={<ArrowRightLeft size={18} />}
          action={
            <button
              onClick={() => onNavigate('penyaluran')}
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Lihat Semua
            </button>
          }
        />
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-100">
                <th className="text-left font-semibold px-5 py-3">Tanggal</th>
                <th className="text-left font-semibold px-5 py-3">Kode</th>
                <th className="text-left font-semibold px-5 py-3">Penerima</th>
                <th className="text-left font-semibold px-5 py-3">Program</th>
                <th className="text-left font-semibold px-5 py-3">Nominal</th>
                <th className="text-left font-semibold px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {penyaluranTerbaru.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 text-sm text-gray-600">{formatTanggal(p.tanggal)}</td>
                  <td className="px-5 py-3 text-sm font-mono text-gray-600">{p.kode}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-gray-900 truncate max-w-[160px]">{p.penerimaNama}</td>
                  <td className="px-5 py-3 text-sm text-gray-600 truncate max-w-[180px]">{p.program}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-gray-900">{formatRupiah(p.nominal)}</td>
                  <td className="px-5 py-3"><Badge variant={statusVariant(p.status)}>{p.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
