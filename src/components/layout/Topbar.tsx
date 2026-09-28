import { useState, useRef, useEffect } from 'react';
import { type PageKey } from '@/types';
import { useApp } from '@/context/AppContext';
import { Bell, Search, Menu, ChevronDown, HandHeart, ArrowRightLeft, Info } from 'lucide-react';

interface TopbarProps {
  page: PageKey;
  onToggleSidebar: () => void;
  onNavigate: (page: PageKey) => void;
}

const pageTitles: Record<PageKey, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Ringkasan aktivitas yayasan' },
  donasi: { title: 'Donasi', subtitle: 'Pencatatan dan pengelolaan donasi' },
  donatur: { title: 'Donatur', subtitle: 'Data dan informasi donatur' },
  penyaluran: { title: 'Penyaluran Dana', subtitle: 'Pengelolaan penyaluran dana' },
  penerima: { title: 'Penerima Dana', subtitle: 'Data penerima manfaat dana' },
  laporan: { title: 'Laporan', subtitle: 'Laporan keuangan yayasan' },
  pengaturan: { title: 'Pengaturan', subtitle: 'Konfigurasi sistem' },
};

export function Topbar({ page, onToggleSidebar, onNavigate }: TopbarProps) {
  const { notifikasi, markAllNotifRead, markNotifRead } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifikasi.filter((n) => !n.dibaca).length;

  /* ── Tutup dropdown kalau klik di luar ── */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const notifIcon = (tipe: string) => {
    if (tipe === 'donasi') return <HandHeart size={16} className="text-brand-600" />;
    if (tipe === 'penyaluran') return <ArrowRightLeft size={16} className="text-amber-600" />;
    return <Info size={16} className="text-sky-600" />;
  };

  const handleNotifClick = (id: number, tipe: string) => {
    markNotifRead(id);
    // Arahkan ke halaman yang relevan
    if (tipe === 'donasi') { onNavigate('donasi'); setNotifOpen(false); }
    else if (tipe === 'penyaluran') { onNavigate('penyaluran'); setNotifOpen(false); }
  };

  const { title, subtitle } = pageTitles[page];

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <div>
          <h2 className="text-lg font-bold text-gray-900 leading-tight">{title}</h2>
          <p className="text-xs text-gray-500 leading-tight hidden sm:block">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-3">
        {/* Search */}
        <div className="hidden lg:flex items-center relative">
          <Search size={18} className="absolute left-3 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari..."
            className="w-56 rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10 focus:outline-none transition-all"
          />
        </div>

        {/* Notifikasi */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Notifikasi"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl ring-1 ring-gray-200 animate-scale-in overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">
                  Notifikasi
                  {unreadCount > 0 && (
                    <span className="ml-2 text-xs text-white bg-red-500 rounded-full px-1.5 py-0.5">{unreadCount}</span>
                  )}
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotifRead}
                    className="text-xs text-brand-600 font-semibold hover:underline"
                  >
                    Tandai semua dibaca
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto scrollbar-thin">
                {notifikasi.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">Tidak ada notifikasi</p>
                ) : (
                  notifikasi.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotifClick(n.id, n.tipe)}
                      className={`flex gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !n.dibaca ? 'bg-brand-50/40' : ''
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                          {notifIcon(n.tipe)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{n.judul}</p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.pesan}</p>
                        <p className="text-xs text-gray-400 mt-1">{n.waktu}</p>
                      </div>
                      {!n.dibaca && (
                        <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="px-4 py-2.5 border-t border-gray-100">
                <button
                  onClick={() => { onNavigate('donasi'); setNotifOpen(false); }}
                  className="w-full text-center text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  Lihat semua aktivitas
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-8 bg-gray-200 hidden sm:block" />

        {/* Profil */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold">
              AH
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-900 leading-tight">Ahmad Hidayat</p>
              <p className="text-xs text-gray-500 leading-tight">Administrator</p>
            </div>
            <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl ring-1 ring-gray-200 animate-scale-in overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-900">Ahmad Hidayat</p>
                <p className="text-xs text-gray-500">admin@yayasan.org</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => { onNavigate('pengaturan'); setProfileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Profil Saya
                </button>
                <button
                  onClick={() => { onNavigate('pengaturan'); setProfileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Pengaturan Akun
                </button>
                <button
                  onClick={() => alert('Fitur logout akan tersedia setelah autentikasi diimplementasikan.')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
