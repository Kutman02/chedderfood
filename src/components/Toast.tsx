import React, { useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { useToastStore, type Toast } from '../stores/toastStore';

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const removeToast = useToastStore((state) => state.removeToast);

  const iconMap = {
    success: <FaCheckCircle className="text-green-500" size={20} />,
    error: <FaTimesCircle className="text-red-500" size={20} />,
    info: <FaInfoCircle className="text-blue-500" size={20} />,
  };

  const bgColorMap = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <div
      className={`${bgColorMap[toast.type || 'success']} border rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 min-w-[300px] max-w-[500px] animate-in slide-in-from-right-full duration-300`}
    >
      {iconMap[toast.type || 'success']}
      <span className="flex-1 text-sm font-medium text-slate-800">{toast.message}</span>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-slate-400 hover:text-slate-600 transition-colors"
      >
        <FaTimes size={14} />
      </button>
    </div>
  );
};

export const Toast: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
