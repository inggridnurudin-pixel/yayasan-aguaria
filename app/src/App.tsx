import { useState } from 'react';
import { type PageKey } from '@/types';
import { AppProvider, useApp } from '@/context/AppContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { ToastContainer } from '@/components/ui/Toast';
import { DashboardPage } from '@/pages/DashboardPage';
import { DonasiPage } from '@/pages/DonasiPage';
import { DonaturPage } from '@/pages/DonaturPage';
import { PenyaluranPage } from '@/pages/PenyaluranPage';
import { PenerimaPage } from '@/pages/PenerimaPage';
import { LaporanPage } from '@/pages/LaporanPage';
import { PengaturanPage } from '@/pages/PengaturanPage';
import { Database, RefreshCw } from 'lucide-react';

/* ── Loading screen ── */
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto mb-4">
          <Database size={32} />
        </div>
        <div className="flex items-center justify-center gap-2 text-brand-600 mb-2">
          <RefreshCw size={18} className="animate-spin" />
          <span className="text-sm font-semibold">Menghubungkan ke database...</span>
        </div>
        <p className="text-xs text-gray-400">Memuat data dari Supabase</p>
      </div>
    </div>
  );
}

/* ── Error screen ── */
function ErrorScreen({ message }: { message: string }) {
  const isCredentialError =
    message.includes('credentials') ||
    message.includes('VITE_SUPABASE') ||
    message.includes('invalid') ||
    message.includes('not found');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg ring-1 ring-gray-200 max-w-lg w-full p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Database size={26} className="text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Koneksi Database Gagal</h2>
        <p className="text-sm text-gray-500 mb-5">{message}</p>

        {isCredentialError && (
          <div className="bg-amber-50 rounded-xl p-4 text-left mb-5 ring-1 ring-amber-200">
            <p className="text-sm font-bold text-amber-800 mb-2">📋 Langkah perbaikan:</p>
            <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
              <li>Buka file <code className="bg-amber-100 px-1 rounded">.env.local</code></li>
              <li>Isi <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_URL</code> dengan Project URL</li>
              <li>Isi <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> dengan anon/public key</li>
              <li>Restart dev server (<code className="bg-amber-100 px-1 rounded">npm run dev</code>)</li>
            </ol>
          </div>
        )}

        <p className="text-xs text-gray-400">
          Temukan kredensial di: Supabase Dashboard → Project Settings → API
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors"
        >
          <RefreshCw size={14} /> Coba Lagi
        </button>
      </div>
    </div>
  );
}

/* ── App utama (pakai context) ── */
function AppInner() {
  const { loading, initError } = useApp();
  const [page, setPage] = useState<PageKey>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (loading) return <LoadingScreen />;
  if (initError) return <ErrorScreen message={initError} />;

  const renderPage = () => {
    switch (page) {
      case 'dashboard':  return <DashboardPage onNavigate={setPage} />;
      case 'donasi':     return <DonasiPage />;
      case 'donatur':    return <DonaturPage />;
      case 'penyaluran': return <PenyaluranPage />;
      case 'penerima':   return <PenerimaPage />;
      case 'laporan':    return <LaporanPage />;
      case 'pengaturan': return <PengaturanPage />;
      default:           return <DashboardPage onNavigate={setPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar current={page} onNavigate={setPage} collapsed={sidebarCollapsed} />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-[72px]' : 'ml-64'}`}>
        <Topbar
          page={page}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onNavigate={setPage}
        />
        <main className="p-4 lg:p-6">{renderPage()}</main>
      </div>
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}

export default App;
