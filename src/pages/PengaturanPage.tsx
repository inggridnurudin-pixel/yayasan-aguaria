import { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Building2, User, Bell, Shield, Database, Palette, Save } from 'lucide-react';

export function PengaturanPage() {
  const [activeSection, setActiveSection] = useState('yayasan');

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
        {activeSection === 'yayasan' && (
          <Card>
            <CardHeader title="Profil Yayasan" subtitle="Informasi dasar yayasan" icon={<Building2 size={18} />} />
            <div className="p-5">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-2xl font-bold">
                  YA
                </div>
                <div>
                  <Button variant="outline" size="sm">Ubah Logo</Button>
                  <p className="text-xs text-gray-500 mt-2">PNG atau JPG, maks 2MB</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Nama Yayasan" defaultValue="Yayasan Amanah Ummat" />
                <Input label="NPY (Nomor Pokok Yayasan)" defaultValue="1234567890123456" />
                <Input label="Nomor Telepon" defaultValue="021-555-0100" />
                <Input label="Email" type="email" defaultValue="info@amanahummat.org" />
                <Input label="Website" defaultValue="www.amanahummat.org" />
                <Select label="Provinsi">
                  <option>DKI Jakarta</option>
                  <option>Jawa Barat</option>
                  <option>Jawa Tengah</option>
                  <option>Jawa Timur</option>
                </Select>
                <div className="sm:col-span-2">
                  <Input label="Alamat" defaultValue="Jl. Sudirman No. 45, Jakarta Pusat" />
                </div>
                <div className="sm:col-span-2">
                  <Input label="Deskripsi" defaultValue="Yayasan sosial keagamaan yang berfokus pada pengelolaan dana donasi dan penyaluran kepada yang berhak." />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-100">
              <Button variant="outline">Batal</Button>
              <Button variant="primary"><Save size={16} /> Simpan Perubahan</Button>
            </div>
          </Card>
        )}

        {activeSection === 'akun' && (
          <Card>
            <CardHeader title="Akun & Pengguna" subtitle="Kelola pengguna sistem" icon={<User size={18} />} />
            <div className="p-5">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-16 h-16 rounded-full bg-brand-600 text-white flex items-center justify-center text-xl font-bold">AH</div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900">Ahmad Hidayat</h4>
                  <p className="text-sm text-gray-500">admin@yayasan.org</p>
                  <Badge variant="primary" size="sm" className="mt-1">Administrator</Badge>
                </div>
                <Button variant="outline" size="sm">Edit Profil</Button>
              </div>
              <h4 className="text-sm font-bold text-gray-900 mb-3">Pengguna Terdaftar</h4>
              <div className="space-y-3">
                {[
                  { nama: 'Ahmad Hidayat', email: 'admin@yayasan.org', role: 'Administrator', status: 'Aktif' },
                  { nama: 'Siti Nurhaliza', email: 'bendahara@yayasan.org', role: 'Bendahara', status: 'Aktif' },
                  { nama: 'Muhammad Rizki', email: 'staff@yayasan.org', role: 'Staff', status: 'Aktif' },
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
                      <Badge variant="success" size="sm">{u.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="secondary" size="sm" className="mt-4">+ Tambah Pengguna</Button>
            </div>
          </Card>
        )}

        {activeSection === 'notifikasi' && (
          <Card>
            <CardHeader title="Pengaturan Notifikasi" subtitle="Kelola preferensi notifikasi" icon={<Bell size={18} />} />
            <div className="p-5 space-y-4">
              {[
                { label: 'Notifikasi Donasi Baru', desc: 'Dapatkan notifikasi saat ada donasi masuk' },
                { label: 'Notifikasi Penyaluran', desc: 'Notifikasi untuk pengajuan dan penyaluran dana' },
                { label: 'Laporan Mingguan', desc: 'Terima ringkasan laporan setiap minggu via email' },
                { label: 'Notifikasi Donatur Baru', desc: 'Notifikasi saat donatur baru terdaftar' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    className={`relative w-11 h-6 rounded-full transition-colors ${i < 2 ? 'bg-brand-600' : 'bg-gray-300'}`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${i < 2 ? 'translate-x-5' : 'translate-x-0.5'}`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeSection === 'keamanan' && (
          <Card>
            <CardHeader title="Keamanan" subtitle="Pengaturan keamanan akun" icon={<Shield size={18} />} />
            <div className="p-5 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3">Ubah Password</h4>
                <div className="space-y-3 max-w-md">
                  <Input label="Password Lama" type="password" placeholder="••••••••" />
                  <Input label="Password Baru" type="password" placeholder="•••••••••" />
                  <Input label="Konfirmasi Password" type="password" placeholder="•••••••••" />
                  <Button variant="primary" size="sm">Ubah Password</Button>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Autentikasi Dua Faktor</h4>
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">2FA via Email</p>
                    <p className="text-xs text-gray-500 mt-0.5">Tambah lapisan keamanan ekstra</p>
                  </div>
                  <Button variant="outline" size="sm">Aktifkan</Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeSection === 'data' && (
          <Card>
            <CardHeader title="Data & Backup" subtitle="Kelola dan cadangkan data" icon={<Database size={18} />} />
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Backup Data</p>
                  <p className="text-xs text-gray-500 mt-0.5">Unduh seluruh data dalam format Excel</p>
                </div>
                <Button variant="outline" size="sm">Download Backup</Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Restore Data</p>
                  <p className="text-xs text-gray-500 mt-0.5">Pulihkan data dari file backup</p>
                </div>
                <Button variant="outline" size="sm">Upload File</Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-red-50">
                <div>
                  <p className="text-sm font-semibold text-red-900">Hapus Semua Data</p>
                  <p className="text-xs text-red-600 mt-0.5">Tindakan ini tidak dapat dibatalkan</p>
                </div>
                <Button variant="danger" size="sm">Hapus</Button>
              </div>
            </div>
          </Card>
        )}

        {activeSection === 'tampilan' && (
          <Card>
            <CardHeader title="Tampilan" subtitle="Kustomisasi tampilan sistem" icon={<Palette size={18} />} />
            <div className="p-5 space-y-5">
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3">Tema Warna</h4>
                <div className="flex gap-3">
                  {[
                    { name: 'Biru', color: 'bg-brand-600', active: true },
                    { name: 'Hijau', color: 'bg-emerald-600', active: false },
                    { name: 'Teal', color: 'bg-teal-600', active: false },
                    { name: 'Slate', color: 'bg-slate-600', active: false },
                  ].map((t) => (
                    <button
                      key={t.name}
                      className={`flex flex-col items-center gap-2 ${t.active ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                    >
                      <div className={`w-12 h-12 rounded-xl ${t.color} ${t.active ? 'ring-2 ring-offset-2 ring-brand-500' : ''}`} />
                      <span className="text-xs font-semibold text-gray-600">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Mode Tampilan</h4>
                <div className="flex gap-3">
                  <button className="flex-1 p-4 rounded-lg border-2 border-brand-500 bg-brand-50 text-center">
                    <p className="text-sm font-semibold text-brand-700">Mode Terang</p>
                  </button>
                  <button className="flex-1 p-4 rounded-lg border-2 border-gray-200 text-center hover:border-gray-300">
                    <p className="text-sm font-semibold text-gray-600">Mode Gelap</p>
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
