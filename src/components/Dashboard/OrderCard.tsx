import { FaPhone, FaMapMarkerAlt, FaUserTie, FaTimes, FaCheckCircle, FaEye, FaExclamationTriangle } from 'react-icons/fa';
import type { Order, TabConfig } from '../../types/types';

interface OrderCardProps {
  order: Order;
  activeTab: string;
  activeTabData?: TabConfig;
  isProcessing: boolean;
  isRemoving: boolean;
  onStatusUpdate: (id: number, status: string) => void;
  onViewDetails: (order: Order) => void;
  onConfirmAction: (orderId: number, status: string, action: string) => void;
  showConfirmation?: boolean;
  confirmationAction?: string;
}

export const OrderCard = ({ 
  order, 
  activeTab, 
  activeTabData, 
  isProcessing, 
  isRemoving, 
  onStatusUpdate,
  onViewDetails,
  onConfirmAction,
  showConfirmation = false,
  confirmationAction = ''
}: OrderCardProps) => {
  const getConfirmationMessage = () => {
    if (confirmationAction === 'принять') return 'Вы точно хотите принять этот заказ в работу?';
    if (confirmationAction === 'завершить') return 'Вы точно хотите завершить этот заказ?';
    if (confirmationAction === 'отменить') return 'Вы точно хотите отменить этот заказ?';
    return 'Вы точно хотите выполнить это действие?';
  };

  const getStatusFromAction = () => {
    if (confirmationAction === 'принять') return 'processing';
    if (confirmationAction === 'завершить') return 'completed';
    if (confirmationAction === 'отменить') return 'cancelled';
    return '';
  };

  const handleConfirm = () => {
    const status = getStatusFromAction();
    if (status) {
      onStatusUpdate(order.id, status);
    }
  };

  const handleCancel = () => {
    onConfirmAction(order.id, '', '');
  };

  return (
    <div className={`bg-white rounded-2xl shadow-md border-2 ${activeTabData?.borderColor} p-5 transition-all duration-300 overflow-hidden ${
      isProcessing ? 'opacity-60 pointer-events-none' : ''
    } ${isRemoving ? 'animate-slide-out-up opacity-0' : ''}`}>
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${activeTabData?.color} flex items-center justify-center text-white font-black`}>
            #{order.number}
          </div>
          <div>
            <h3 className="text-lg font-black">{order.billing.first_name} {order.billing.last_name}</h3>
            <a href={`tel:${order.billing.phone}`} className="text-orange-600 font-bold flex items-center gap-2">
              <FaPhone size={12}/> {order.billing.phone}
            </a>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase">Сумма</p>
          <p className="text-lg font-black text-green-600">{order.total} сом</p>
        </div>
      </div>

      <div className={`${activeTabData?.bgColor} p-3 rounded-xl mb-4 border`}>
        <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
          <FaMapMarkerAlt /> Адрес:
        </p>
        <p className="text-sm font-semibold">{order.billing.address_1}</p>
      </div>

      {/* Кнопка просмотра деталей */}
      <div className="mb-4">
        <button
          onClick={() => onViewDetails(order)}
          className="w-full bg-slate-100 text-slate-700 py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
        >
          <FaEye /> Просмотреть детали заказа
        </button>
      </div>

      {/* Кнопки действий для новых заказов */}
      {activeTab === 'on-hold' && !showConfirmation && (
        <div className="flex gap-2">
          <button 
            onClick={() => onConfirmAction(order.id, 'processing', 'принять')}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold uppercase text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <FaUserTie /> Принять заказ
          </button>
          <button 
            onClick={() => onConfirmAction(order.id, 'cancelled', 'отменить')}
            className="px-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Кнопки действий для заказов в работе */}
      {activeTab === 'processing' && !showConfirmation && (
        <div className="flex gap-2">
          <button 
            onClick={() => onConfirmAction(order.id, 'completed', 'завершить')}
            className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold uppercase text-sm flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
          >
            <FaCheckCircle /> Завершить заказ
          </button>
          <button 
            onClick={() => onConfirmAction(order.id, 'cancelled', 'отменить')}
            className="px-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Встроенное подтверждение действия */}
      {showConfirmation && (
        <div className="mt-4 pt-4 border-t-2 border-slate-200 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-amber-50 rounded-xl p-4 mb-4 border border-amber-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <FaExclamationTriangle className="text-amber-600" />
              </div>
              <h4 className="text-base font-black text-slate-900">Подтверждение действия</h4>
            </div>
            <p className="text-slate-700 ml-13">{getConfirmationMessage()}</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors active:scale-95"
            >
              Нет
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 px-4 py-3 ${
                confirmationAction === 'отменить' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : confirmationAction === 'завершить'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white rounded-xl font-bold transition-colors active:scale-95`}
            >
              Да
            </button>
          </div>
        </div>
      )}
    </div>
  );
};