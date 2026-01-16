import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Да',
  cancelText = 'Нет',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
        {/* Заголовок */}
        <div className="border-b border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="text-red-600" size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          </div>
        </div>

        {/* Контент */}
        <div className="p-4">
          <p className="text-slate-600 mb-6">{message}</p>

          {/* Кнопки */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-200 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
