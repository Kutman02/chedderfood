import { FaTimes, FaPhone, FaMapMarkerAlt, FaCalendar, FaCreditCard, FaTruck } from 'react-icons/fa';
import type { Order } from '../../types/types';

interface OrderDetailsModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
}

export const OrderDetailsModal = ({ isOpen, order, onClose }: OrderDetailsModalProps) => {
  if (!isOpen || !order) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm overflow-hidden">
      <div className="bg-white w-full h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <div className="shrink-0 bg-white border-b border-slate-200 p-4 md:p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900">Заказ #{order.number}</h2>
            <p className="text-sm text-slate-500 mt-1">Детали заказа</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-y-contain p-4 md:p-6 space-y-4 md:space-y-6" style={{ WebkitOverflowScrolling: 'touch' }}>
          {/* Информация о клиенте */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <FaPhone className="text-orange-600" /> Информация о клиенте
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Имя</p>
                <p className="text-sm font-semibold">{order.billing.first_name} {order.billing.last_name}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Телефон</p>
                <a href={`tel:${order.billing.phone}`} className="text-sm font-semibold text-orange-600">
                  {order.billing.phone}
                </a>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Дата заказа</p>
                <p className="text-sm font-semibold flex items-center gap-2">
                  <FaCalendar size={12} /> {formatDate(order.date_created)}
                </p>
              </div>
            </div>
          </div>

          {/* Адрес доставки */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-600" /> Адрес доставки
            </h3>
            <p className="text-sm font-semibold mb-1">{order.billing.address_1}</p>
            {order.billing.address_2 && (
              <p className="text-sm text-slate-600">{order.billing.address_2}</p>
            )}
            <p className="text-sm text-slate-600 mt-2">
              {order.billing.city}, {order.billing.postcode}
            </p>
          </div>

          {/* Товары в заказе */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-4">
            <h3 className="text-lg font-black text-slate-900 mb-4">Товары в заказе</h3>
            <div className="space-y-3">
              {order.line_items && order.line_items.length > 0 ? (
                order.line_items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">Количество: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-green-600">{item.total} {order.currency}</p>
                      <p className="text-xs text-slate-500">{item.price} {order.currency} за шт.</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-4">Товары не найдены</p>
              )}
            </div>
          </div>

          {/* Стоимость */}
          <div className="bg-green-50 rounded-xl p-4">
            <div className="space-y-2">
              {order.shipping_total && parseFloat(order.shipping_total) > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                    <FaTruck size={12} /> Доставка:
                  </span>
                  <span className="text-sm font-bold">{order.shipping_total} {order.currency}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-green-200">
                <span className="text-lg font-black text-slate-900">Итого:</span>
                <span className="text-2xl font-black text-green-600">{order.total} {order.currency}</span>
              </div>
            </div>
          </div>

          {/* Способ оплаты */}
          {order.payment_method_title && (
            <div className="bg-purple-50 rounded-xl p-4">
              <h3 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
                <FaCreditCard className="text-purple-600" /> Способ оплаты
              </h3>
              <p className="text-sm font-semibold">{order.payment_method_title}</p>
            </div>
          )}

          {/* Примечание клиента */}
          {order.customer_note && (
            <div className="bg-amber-50 rounded-xl p-4">
              <h3 className="text-lg font-black text-slate-900 mb-2">Примечание клиента</h3>
              <p className="text-sm text-slate-700">{order.customer_note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

