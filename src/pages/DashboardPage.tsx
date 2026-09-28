import { Card, CardHeader } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { AreaChart } from '@/components/charts/AreaChart';
import { BarChart } from '@/components/charts/BarChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { donasiData, penyaluranData, chartDonasiBulanan, chartPenyaluranBulanan } from '@/data/dummyData';
import { formatRupiah, formatRupiahShort, formatTanggal } from '@/utils/format';
import { TrendingUp, TrendingDown, Wallet, Users, HandHeart, ArrowRightLeft, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const totalDonasi = donasiData.filter((d) => d.status === 'Lunas').reduce((s, d) => s + d.nominal, 0);
const totalPenyaluran = penyaluranData.filter((p) => p.status === 'Disalurkan').reduce((s, p) => s + p.nominal, 0);
const saldoDana = totalDonasi - totalPenyaluran;
const jumlahDonatur = 10;

const stats = [
  { label: 'Total Donasi', value: formatRupiah(totalDonasi), change: '+12.5%', trend: 'up', icon: HandHeart, color: 'brand' },
  { label: 'Total Penyaluran Dana', value: formatRupiah(totalPenyaluran), change: '+8.2%', trend: 'up', icon: ArrowRightLeft, color: 'amber' },
  { label: 'Saldo Dana', value: formatRupiah(saldoDana), change: '+15.3%', trend: 'up', icon: Wallet, color: 'emerald' },
  { label: 'Jumlah Donatur', value: String(jumlahDonatur), change: '+2', trend: 'up', icon: Users, color: 'sky' },
];

const colorMap: Record<string, string> = {
  brand: 'bg-brand-50 text-brand-600',
  amber: 'bg-amber-50 text-amber-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  sky: 'bg-sky-50 text-sky-600',
};

export function DashboardPage() {
  const donasiTerbaru = donasiData.slice(0, 5);
  const penyaluranTerbaru = penyaluranData.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            title="Grafik Pemasukan Donasi"
            subtitle="6 bulan terakhir"
            icon={<TrendingUp size={18} />}
            action={<Badge variant="success" size="sm"><TrendingUp size={12} /> +18.2%</Badge>}
          />
          <div className="p-5">
            <AreaChart data={chartDonasiBulanan.map((d) => ({ label: d.bulan, value: d.nilai }))} color="#2563eb" height={220} />
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
            <BarChart data={chartPenyaluranBulanan.map((d) => ({ label: d.bulan, value: d.nilai }))} color="#f59e0b" height={220} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader title="Komposisi Donasi" subtitle="Berdasarkan jenis" icon={<HandHeart size={18} />} />
          <div className="p-5 flex justify-center">
            <DonutChart
              data={[
                { label: 'Tunai', value: 45, color: '#2563eb' },
                { label: 'Zakat', value: 20, color: '#f59e0b' },
                { label: 'Infaq', value: 15, color: '#10b981' },
                { label: 'Wakaf', value: 12, color: '#8b5cf6' },
                { label: 'Barang', value: 8, color: '#64748b' },
              ]}
              centerValue="100%"
              centerLabel="Total"
            />
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader
            title="Transaksi Donasi Terbaru"
            subtitle="5 transaksi terakhir"
            icon={<HandHeart size={18} />}
            action={<button className="text-sm font-semibold text-brand-600 hover:text-brand-700">Lihat Semua</button>}
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

      <Card>
        <CardHeader
          title="Penyaluran Dana Terbaru"
          subtitle="5 penyaluran terakhir"
          icon={<ArrowRightLeft size={18} />}
          action={<button className="text-sm font-semibold text-brand-600 hover:text-brand-700">Lihat Semua</button>}
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
