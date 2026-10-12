import { type PageKey } from '@/types';
import {
  LayoutDashboard,
  HandHeart,
  Users,
  ArrowRightLeft,
  UserCheck,
  FileText,
  Settings,
  HeartHandshake,
} from 'lucide-react';

interface SidebarProps {
  current: PageKey;
  onNavigate: (page: PageKey) => void;
  collapsed: boolean;
}

const menuItems: { key: PageKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'donasi', label: 'Donasi', icon: HandHeart },
  { key: 'donatur', label: 'Donatur', icon: Users },
  { key: 'penyaluran', label: 'Penyaluran Dana', icon: ArrowRightLeft },
  { key: 'penerima', label: 'Penerima Dana', icon: UserCheck },
  { key: 'laporan', label: 'Laporan', icon: FileText },
  { key: 'pengaturan', label: 'Pengaturan', icon: Settings },
];

export function Sidebar({ current, onNavigate, collapsed }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 z-30 h-screen bg-white border-r border-gray-200 transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      <div className="flex items-center gap-3 px-5 h-16 border-b border-gray-100">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-600 text-white shrink-0">
          <HeartHandshake size={22} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-gray-900 leading-tight">SIDONA</h1>
            <p className="text-xs text-gray-500 leading-tight">Sistem Donasi Yayasan</p>
          </div>
        )}
      </div>

      <nav className="px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = current === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 group relative ${
                active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-600 rounded-r-full" />
              )}
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="absolute bottom-4 left-3 right-3">
          <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl p-4 text-white">
            <p className="text-xs font-semibold mb-1">Butuh Bantuan?</p>
            <p className="text-xs text-brand-100 mb-3">Hubungi tim support kami</p>
            <button className="w-full bg-white/20 hover:bg-white/30 rounded-lg py-2 text-xs font-semibold transition-colors">
              Hubungi Support
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
