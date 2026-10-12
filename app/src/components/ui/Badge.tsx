import { type ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';
  size?: 'sm' | 'md';
}

const variantStyles: Record<string, string> = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  warning: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  danger: 'bg-red-50 text-red-700 ring-red-600/20',
  info: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  neutral: 'bg-gray-100 text-gray-600 ring-gray-500/20',
  primary: 'bg-brand-50 text-brand-700 ring-brand-600/20',
};

export function Badge({ children, variant = 'neutral', size = 'sm' }: BadgeProps) {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ring-1 ring-inset ${sizeClass} ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}

export function statusVariant(status: string): BadgeProps['variant'] {
  switch (status) {
    case 'Lunas':
    case 'Disalurkan':
    case 'Aktif':
      return 'success';
    case 'Pending':
    case 'Diajukan':
      return 'warning';
    case 'Gagal':
    case 'Ditolak':
    case 'Nonaktif':
    case 'Tidak Aktif':
      return 'danger';
    default:
      return 'neutral';
  }
}
