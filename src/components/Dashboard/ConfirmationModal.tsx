import { FaExclamationTriangle } from 'react-icons/fa';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'warning' | 'danger';
}

export const ConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Да',
  cancelText = 'Нет',
  onConfirm,
  onCancel,
  type = 'warning'
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  const confirmColor = type === 'danger' 
    ? 'bg-red-600 hover:bg-red-700' 
    : 'bg-blue-600 hover:bg-blue-700';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center transition-opacity"
      onClick={onCancel}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-in zoom-in-95 duration-200 border-2 border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            type === 'danger' ? 'bg-red-100' : 'bg-amber-100'
          }`}>
            <FaExclamationTriangle className={type === 'danger' ? 'text-red-600' : 'text-amber-600'} />
          </div>
          <h3 className="text-xl font-black text-slate-900">{title}</h3>
        </div>
        
        <p className="text-slate-600 mb-6 text-base leading-relaxed">{message}</p>
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors active:scale-95"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-3 ${confirmColor} text-white rounded-xl font-bold transition-colors active:scale-95`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

