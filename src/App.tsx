import { useState } from 'react';
import { type PageKey } from '@/types';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { DashboardPage } from '@/pages/DashboardPage';
import { DonasiPage } from '@/pages/DonasiPage';
import { DonaturPage } from '@/pages/DonaturPage';
import { PenyaluranPage } from '@/pages/PenyaluranPage';
import { PenerimaPage } from '@/pages/PenerimaPage';
import { LaporanPage } from '@/pages/LaporanPage';
import { PengaturanPage } from '@/pages/PengaturanPage';

function App() {
  const [page, setPage] = useState<PageKey>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <DashboardPage />;
      case 'donasi':
        return <DonasiPage />;
      case 'donatur':
        return <DonaturPage />;
      case 'penyaluran':
        return <PenyaluranPage />;
      case 'penerima':
        return <PenerimaPage />;
      case 'laporan':
        return <LaporanPage />;
      case 'pengaturan':
        return <PengaturanPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar current={page} onNavigate={setPage} collapsed={sidebarCollapsed} />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-[72px]' : 'ml-64'}`}>
        <Topbar page={page} onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className="p-4 lg:p-6">{renderPage()}</main>
      </div>
    </div>
  );
}

export default App;
