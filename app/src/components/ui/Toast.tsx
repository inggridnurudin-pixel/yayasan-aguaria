import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useApp, type Toast } from '@/context/AppContext';

const icons = {
  success: <CheckCircle size={18} className="text-emerald-500 shrink-0" />,
  error: <XCircle size={18} className="text-red-500 shrink-0" />,
  info: <Info size={18} className="text-sky-500 shrink-0" />,
};

const borderColor = {
  success: 'border-l-emerald-400',
  error: 'border-l-red-400',
  info: 'border-l-sky-400',
};

function ToastItem({ toast }: { toast: Toast }) {
  const { dismissToast } = useApp();

  useEffect(() => {
    const t = setTimeout(() => dismissToast(toast.id), 3400);
    return () => clearTimeout(t);
  }, [toast.id, dismissToast]);

  return (
    <div
      className={`flex items-start gap-3 bg-white rounded-xl shadow-lg ring-1 ring-gray-200 border-l-4 ${borderColor[toast.type]} px-4 py-3 min-w-[260px] max-w-sm animate-scale-in`}
    >
      {icons[toast.type]}
      <p className="text-sm font-semibold text-gray-800 flex-1 leading-snug">{toast.message}</p>
      <button
        onClick={() => dismissToast(toast.id)}
        className="p-0.5 rounded text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useApp();
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
