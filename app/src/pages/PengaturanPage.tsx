import { useState, useEffect } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import { fetchPengaturan, savePengaturan, type ProfilYayasan, type NotifSettingsDb } from '@/lib/services';
import { Building2, User, Bell, Shield, Database, Palette, Save, Loader2 } from 'lucide-react';

interface PasswordForm {
  lama: string;
  baru: string;
  konfirmasi: string;
}

const DEFAULT_PROFIL: ProfilYayasan = {
  nama: 'Yayasan Amanah Ummat',
  npy: '1234567890123456',
  telepon: '021-555-0100',
  email: 'info@amanahummat.org',
  website: 'www.amanahummat.org',
  provinsi: 'DKI Jakarta',
  alamat: 'Jl. Sudirman No. 45, Jakarta Pusat',
  deskripsi: 'Yayasan sosial keagamaan yang berfokus pada pengelolaan dana donasi dan penyaluran kepada yang berhak.',
};

const DEFAULT_NOTIF: NotifSettingsDb = {
  donasiMasuk: true,
  penyaluran: true,
  laporanMingguan: false,
  donaturBaru: false,
};

export function PengaturanPage() {
  const { showToast } = useApp();
  const [activeSection, setActiveSection] = useState('yayasan');

  /* ── Profil Yayasan ── */
  const [yayasan, setYayasan] = useState<ProfilYayasan>(DEFAULT_PROFIL);
  const [loadingYayasan, setLoadingYayasan] = useState(true);
  const [savingYayasan, setSavingYayasan] = useState(false);

  /* ── Notifikasi ── */
  const [notifSettings, setNotifSettings] = useState<NotifSettingsDb>(DEFAULT_NOTIF);
  const [loadingNotif, setLoadingNotif] = useState(true);
  const [savingNotif, setSavingNotif] = useState(false);

  /* ── Password ── */
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({ lama: '', baru: '', konfirmasi: '' });
  const [passwordError, setPasswordError] = useState('');

  /* ── Tampilan ── */
  const [activeTheme, setActiveTheme] = useState('Biru');
  const [darkMode, setDarkMode] = useState(false);

  /* ── Load dari Supabase saat halaman aktif ── */
  useEffect(() => {
    if (activeSection === 'yayasan' && loadingYayasan) {
      fetchPengaturan<ProfilYayasan>('profil_yayasan', DEFAULT_PROFIL)
        .then((val) => setYayasan(val))
        .catch(() => {/* gunakan default */})
        .finally(() => setLoadingYayasan(false));
    }
  }, [activeSection, loadingYayasan]);

  useEffect(() => {
    if (activeSection === 'notifikasi' && loadingNotif) {
      fetchPengaturan<NotifSettingsDb>('notif_settings', DEFAULT_NOTIF)
        .then((val) => setNotifSettings(val))
        .catch(() => {/* gunakan default */})
        .finally(() => setLoadingNotif(false));
    }
  }, [activeSection, loadingNotif]);

  /* ── Simpan Profil Yayasan ke Supabase ── */
  const handleSaveYayasan = async () => {
    if (!yayasan.nama.trim()) { showToast('Nama yayasan wajib diisi', 'error'); return; }
    setSavingYayasan(true);
    try {
      await savePengaturan('profil_yayasan', yayasan);
      showToast('Profil yayasan berhasil disimpan');
    } catch (e) {
      showToast(`Gagal menyimpan: ${(e as Error).message}`, 'error');
    } finally {
      setSavingYayasan(false);
    }
  };

  /* ── Simpan Notifikasi ke Supabase ── */
  const handleSaveNotif = async () => {
    setSavingNotif(true);
    try {
      await savePengaturan('notif_settings', notifSettings);
      showToast('Preferensi notifikasi berhasil disimpan');
    } catch (e) {
      showToast(`Gagal menyimpan: ${(e as Error).message}`, 'error');
    } finally {
      setSavingNotif(false);
    }
  };

  /* ── Ubah Password ── */
  const handleSavePassword = () => {
    if (!passwordForm.lama) { setPasswordError('Password lama wajib diisi'); return; }
    if (passwordForm.baru.length < 6) { setPasswordError('Password baru minimal 6 karakter'); return; }
    if (passwordForm.baru !== passwordForm.konfirmasi) { setPasswordError('Konfirmasi password tidak cocok'); return; }
    setPasswordError('');
    setPasswordForm({ lama: '', baru: '', konfirmasi: '' });
    showToast('Password berhasil diubah');
  };

  const notifItems: { key: keyof NotifSettingsDb; label: string; desc: string }[] = [
    { key: 'donasiMasuk', label: 'Notifikasi Donasi Baru', desc: 'Dapatkan notifikasi saat ada donasi masuk' },
    { key: 'penyaluran', label: 'Notifikasi Penyaluran', desc: 'Notifikasi untuk pengajuan dan penyaluran dana' },
    { key: 'laporanMingguan', label: 'Laporan Mingguan', desc: 'Terima ringkasan laporan setiap minggu via email' },
    { key: 'donaturBaru', label: 'Notifikasi Donatur Baru', desc: 'Notifikasi saat donatur baru terdaftar' },
  ];

  const sections = [
    { key: 'yayasan', label: 'Profil Yayasan', icon: Building2 },
    { key: 'akun', label: 'Akun & Pengguna', icon: User },
    { key: 'notifikasi', label: 'Notifikasi', icon: Bell },
    { key: 'keamanan', label: 'Keamanan', icon: Shield },
    { key: 'data', label: 'Data & Backup', icon: Database },
    { key: 'tampilan', label: 'Tampilan', icon: Palette },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 animate-fade-in">
      {/* Sidebar */}
      <Card className="lg:col-span-1 h-fit">
        <div className="p-3">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeSection === s.key
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                {s.label}
              </button>
            );
          })}
        </div>
      </Card>

      <div className="lg:col-span-3 space-y-5">

        {/* ── Profil Yayasan ── */}
        {activeSection === 'yayasan' && (
          <Card>
            <CardHeader title="Profil Yayasan" subtitle="Informasi dasar yayasan" icon={<Building2 size={18} />} />
            {loadingYayasan ? (
              <div className="p-10 flex items-center justify-center gap-2 text-gray-400">
                <Loader2 size={20} className="animate-spin" />
                <span className="text-sm">Memuat data...</span>
              </div>
            ) : (
              <>
                <div className="p-5">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-2xl font-bold">
                      {yayasan.nama.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase() || 'YA'}
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Ubah Logo</Button>
                      <p className="text-xs text-gray-500 mt-2">PNG atau JPG, maks 2MB</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Nama Yayasan"
                      value={yayasan.nama}
                      onChange={(e) => setYayasan((f) => ({ ...f, nama: e.target.value }))}
                    />
                    <Input
                      label="NPY (Nomor Pokok Yayasan)"
                      value={yayasan.npy}
                      onChange={(e) => setYayasan((f) => ({ ...f, npy: e.target.value }))}
                    />
                    <Input
                      label="Nomor Telepon"
                      value={yayasan.telepon}
                      onChange={(e) => setYayasan((f) => ({ ...f, telepon: e.target.value }))}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={yayasan.email}
                      onChange={(e) => setYayasan((f) => ({ ...f, email: e.target.value }))}
                    />
                    <Input
                      label="Website"
                      value={yayasan.website}
                      onChange={(e) => setYayasan((f) => ({ ...f, website: e.target.value }))}
                    />
                    <Select
                      label="Provinsi"
                      value={yayasan.provinsi}
                      onChange={(e) => setYayasan((f) => ({ ...f, provinsi: e.target.value }))}
                    >
                      {['DKI Jakarta','Jawa Barat','Jawa Tengah','Jawa Timur','Banten',
                        'Sumatera Utara','Sumatera Selatan','Sulawesi Selatan','Kalimantan Timur',
                        'Bali','DIY Yogyakarta','Riau','Aceh'].map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </Select>
                    <div className="sm:col-span-2">
                      <Input
                        label="Alamat"
                        value={yayasan.alamat}
                        onChange={(e) => setYayasan((f) => ({ ...f, alamat: e.target.value }))}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Input
                        label="Deskripsi"
                        value={yayasan.deskripsi}
                        onChange={(e) => setYayasan((f) => ({ ...f, deskripsi: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    onClick={() => { setYayasan(DEFAULT_PROFIL); setLoadingYayasan(true); }}
                    disabled={savingYayasan}
                  >
                    Batal
                  </Button>
                  <Button variant="primary" onClick={handleSaveYayasan} disabled={savingYayasan}>
                    {savingYayasan
                      ? <><Loader2 size={16} className="animate-spin" /> Menyimpan...</>
                      : <><Save size={16} /> Simpan Perubahan</>
                    }
                  </Button>
                </div>
              </>
            )}
          </Card>
        )}

        {/* ── Akun & Pengguna ── */}
        {activeSection === 'akun' && (
          <Card>
            <CardHeader title="Akun & Pengguna" subtitle="Kelola pengguna sistem" icon={<User size={18} />} />
            <div className="p-5">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-16 h-16 rounded-full bg-brand-600 text-white flex items-center justify-center text-xl font-bold">AH</div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900">Ahmad Hidayat</h4>
                  <p className="text-sm text-gray-500">admin@yayasan.org</p>
                  <Badge variant="primary" size="sm">Administrator</Badge>
                </div>
                <Button variant="outline" size="sm" onClick={() => showToast('Fitur edit profil akan segera tersedia.', 'info')}>
                  Edit Profil
                </Button>
              </div>
              <h4 className="text-sm font-bold text-gray-900 mb-3">Pengguna Terdaftar</h4>
              <div className="space-y-3">
                {[
                  { nama: 'Ahmad Hidayat', email: 'admin@yayasan.org', role: 'Administrator' },
                  { nama: 'Siti Nurhaliza', email: 'bendahara@yayasan.org', role: 'Bendahara' },
                  { nama: 'Muhammad Rizki', email: 'staff@yayasan.org', role: 'Staff' },
                ].map((u) => (
                  <div key={u.email} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold">
                        {u.nama.split(' ').map((w) => w[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{u.nama}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="info" size="sm">{u.role}</Badge>
                      <Badge variant="success" size="sm">Aktif</Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="secondary" size="sm" className="mt-4"
                onClick={() => showToast('Fitur tambah pengguna akan segera tersedia.', 'info')}>
                + Tambah Pengguna
              </Button>
            </div>
          </Card>
        )}

        {/* ── Notifikasi ── */}
        {activeSection === 'notifikasi' && (
          <Card>
            <CardHeader title="Pengaturan Notifikasi" subtitle="Kelola preferensi notifikasi" icon={<Bell size={18} />} />
            {loadingNotif ? (
              <div className="p-10 flex items-center justify-center gap-2 text-gray-400">
                <Loader2 size={20} className="animate-spin" />
                <span className="text-sm">Memuat preferensi...</span>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                {notifItems.map((item) => {
                  const active = notifSettings[item.key];
                  return (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifSettings((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                        className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/30 ${
                          active ? 'bg-brand-600' : 'bg-gray-300'
                        }`}
                        aria-pressed={active}
                        aria-label={item.label}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                          active ? 'translate-x-5' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  );
                })}
                <div className="pt-2">
                  <Button variant="primary" size="sm" onClick={handleSaveNotif} disabled={savingNotif}>
                    {savingNotif
                      ? <><Loader2 size={16} className="animate-spin" /> Menyimpan...</>
                      : <><Save size={16} /> Simpan Preferensi</>
                    }
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* ── Keamanan ── */}
        {activeSection === 'keamanan' && (
          <Card>
            <CardHeader title="Keamanan" subtitle="Pengaturan keamanan akun" icon={<Shield size={18} />} />
            <div className="p-5 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3">Ubah Password</h4>
                <div className="space-y-3 max-w-md">
                  <Input label="Password Lama" type="password" placeholder="••••••••"
                    value={passwordForm.lama}
                    onChange={(e) => setPasswordForm((f) => ({ ...f, lama: e.target.value }))} />
                  <Input label="Password Baru" type="password" placeholder="Min. 6 karakter"
                    value={passwordForm.baru}
                    onChange={(e) => setPasswordForm((f) => ({ ...f, baru: e.target.value }))} />
                  <Input label="Konfirmasi Password" type="password" placeholder="Ulangi password baru"
                    value={passwordForm.konfirmasi}
                    onChange={(e) => setPasswordForm((f) => ({ ...f, konfirmasi: e.target.value }))} />
                  {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
                  <Button variant="primary" size="sm" onClick={handleSavePassword}>Ubah Password</Button>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Autentikasi Dua Faktor</h4>
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">2FA via Email</p>
                    <p className="text-xs text-gray-500 mt-0.5">Tambah lapisan keamanan ekstra</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => showToast('Fitur 2FA akan segera tersedia.', 'info')}>
                    Aktifkan
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* ── Data & Backup ── */}
        {activeSection === 'data' && (
          <Card>
            <CardHeader title="Data & Backup" subtitle="Kelola dan cadangkan data" icon={<Database size={18} />} />
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Backup Data</p>
                  <p className="text-xs text-gray-500 mt-0.5">Unduh seluruh data dalam format JSON</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => showToast('Proses backup dimulai...', 'info')}>
                  Download Backup
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Restore Data</p>
                  <p className="text-xs text-gray-500 mt-0.5">Pulihkan data dari file backup</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => showToast('Fitur restore akan segera tersedia.', 'info')}>
                  Upload File
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-red-50">
                <div>
                  <p className="text-sm font-semibold text-red-900">Hapus Semua Data</p>
                  <p className="text-xs text-red-600 mt-0.5">Tindakan ini tidak dapat dibatalkan</p>
                </div>
                <Button variant="danger" size="sm"
                  onClick={() => {
                    if (window.confirm('Yakin ingin menghapus SEMUA data? Tindakan ini tidak dapat dibatalkan.')) {
                      showToast('Fitur ini memerlukan konfirmasi tambahan', 'error');
                    }
                  }}>
                  Hapus
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* ── Tampilan ── */}
        {activeSection === 'tampilan' && (
          <Card>
            <CardHeader title="Tampilan" subtitle="Kustomisasi tampilan sistem" icon={<Palette size={18} />} />
            <div className="p-5 space-y-5">
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3">Tema Warna</h4>
                <div className="flex gap-3">
                  {[
                    { name: 'Biru', color: 'bg-brand-600' },
                    { name: 'Hijau', color: 'bg-emerald-600' },
                    { name: 'Teal', color: 'bg-teal-600' },
                    { name: 'Slate', color: 'bg-slate-600' },
                  ].map((t) => (
                    <button key={t.name}
                      onClick={() => { setActiveTheme(t.name); showToast(`Tema ${t.name} diterapkan`); }}
                      className={`flex flex-col items-center gap-2 transition-opacity ${activeTheme === t.name ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                    >
                      <div className={`w-12 h-12 rounded-xl ${t.color} ${activeTheme === t.name ? 'ring-2 ring-offset-2 ring-brand-500' : ''}`} />
                      <span className="text-xs font-semibold text-gray-600">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Mode Tampilan</h4>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setDarkMode(false); showToast('Mode Terang diaktifkan'); }}
                    className={`flex-1 p-4 rounded-lg border-2 text-center transition-all ${!darkMode ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <p className={`text-sm font-semibold ${!darkMode ? 'text-brand-700' : 'text-gray-600'}`}>☀️ Mode Terang</p>
                  </button>
                  <button
                    onClick={() => { setDarkMode(true); showToast('Mode Gelap diaktifkan (pratinjau saja)', 'info'); }}
                    className={`flex-1 p-4 rounded-lg border-2 text-center transition-all ${darkMode ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <p className={`text-sm font-semibold ${darkMode ? 'text-brand-700' : 'text-gray-600'}`}>🌙 Mode Gelap</p>
                  </button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
