import React, { useState, useLayoutEffect } from 'react';
import { FaTimes, FaCheckCircle, FaPrint, FaShare, FaSync } from 'react-icons/fa';
import { useGetPublicOrderQuery } from '../app/services/publicApi';
import type { Product, OrderItem, PublicOrder } from '../types/types';
import { useScrollLockStore } from '../stores/scrollLockStore';

interface OrderReceiptProps {
  orderData: PublicOrder;
  products: Product[];
  onClose: () => void;
  onNewOrder: () => void;
}

export const OrderReceipt: React.FC<OrderReceiptProps> = ({
  orderData,
  products,
  onClose,
  onNewOrder,
}) => {
  const lockScroll = useScrollLockStore((s) => s.lock);
  const unlockScroll = useScrollLockStore((s) => s.unlock);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: latestOrder, refetch } = useGetPublicOrderQuery(orderData.id.toString(), {
    pollingInterval: 30000,
  });

  // Блокируем прокрутку при открытии чека
  useLayoutEffect(() => {
    lockScroll();
    return () => {
      unlockScroll();
    };
  }, [lockScroll, unlockScroll]);

  const currentOrderData = latestOrder || orderData;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getShippingInfo = () => {
    const shipping = currentOrderData.shipping;
    const billing = currentOrderData.billing;
    
    return {
      method: currentOrderData.shipping_lines?.[0]?.method_title || 'Стандартная доставка',
      address: `${shipping.address_1 || billing.address_1}, ${shipping.city || billing.city}`,
      cost: Number(currentOrderData.shipping_total || 0),
      status: currentOrderData.shipping_status || 'В обработке',
    };
  };

  const shippingCost = Number(currentOrderData.shipping_total || 0);
  const subtotal = currentOrderData.line_items.reduce((sum: number, item: OrderItem) => {
    return sum + Number(item.total || 0);
  }, 0);
  const total = Number(currentOrderData.total || 0);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Заказ #${currentOrderData.id} - BurgerFood`,
          text: `Мой заказ #${currentOrderData.id} на сумму ${total} сом`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    }
  };

  const orderItems = currentOrderData.line_items.map((item: OrderItem) => {
    const product = products.find(p => p.id === item.product_id);
    return {
      ...item,
      name: product?.name || item.name,
      image: product?.images?.[0]?.src || '/placeholder-image.jpg',
      total: Number(item.total || 0),
    };
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'on-hold':
        return 'Ожидаем подтверждение от ресторана';
      case 'processing':
        return 'Ваш заказ готовится';
      case 'completed':
        return 'Завершен';
      case 'cancelled':
        return 'Ресторан не подтвердил заказ';
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="shrink-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-green-600" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">Заказ успешно оформлен!</h2>
              <p className="text-sm text-slate-600">Автообновление каждые 30 секунд</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
              title="Обновить статус"
            >
              <FaSync className={isRefreshing ? 'animate-spin' : ''} size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6" id="receipt-content">
          <div className="text-center mb-8 border-b-2 border-slate-200 pb-6">
            <h1 className="text-2xl font-black text-slate-800 mb-2">BURGERFOOD</h1>
            <p className="text-slate-600">Курманжан датка 12, Ош, Кыргызстан</p>
            <p className="text-lg font-bold text-orange-600 mt-2">СЧЕТ</p>
          </div>

          <div className="mb-6 bg-slate-50 rounded-lg p-4">
            <h3 className="font-bold text-slate-800 mb-3">Информация о клиенте</h3>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span className="text-slate-600">Имя:</span>
                <span className="font-medium">{currentOrderData.billing.first_name}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-600">Телефон:</span>
                <span className="font-medium">{currentOrderData.billing.phone}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-600">Адрес:</span>
                <span className="font-medium">{currentOrderData.billing.address_1}</span>
              </p>
            </div>
          </div>

          <div className="mb-6 bg-orange-50 rounded-lg p-4">
            <h3 className="font-bold text-slate-800 mb-3">Информация о заказе</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-600">Номер счета:</p>
                <p className="font-bold text-lg">{currentOrderData.id}</p>
              </div>
              <div>
                <p className="text-slate-600">Дата счета:</p>
                <p className="font-bold">{formatDate(currentOrderData.date_created)}</p>
              </div>
              <div>
                <p className="text-slate-600">Номер заказа:</p>
                <p className="font-bold text-lg text-orange-600">#{currentOrderData.id}</p>
              </div>
              <div>
                <p className="text-slate-600">Дата заказа:</p>
                <p className="font-bold">{formatDate(currentOrderData.date_created)}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-orange-200">
              <p className="text-slate-600">Метод оплаты:</p>
              <p className="font-bold">{currentOrderData.payment_method_title || 'Оплата при получении'}</p>
            </div>
            <div className="mt-3 pt-3 border-t border-orange-200">
              <p className="text-slate-600">Способ доставки:</p>
              <p className="font-bold">{getShippingInfo().method}</p>
              <p className="text-sm text-slate-600">{getShippingInfo().address}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-slate-800 mb-3">Заказанные товары</h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium text-slate-700">Товар</th>
                    <th className="text-center p-3 text-sm font-medium text-slate-700">Количество</th>
                    <th className="text-right p-3 text-sm font-medium text-slate-700">Цена</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item: OrderItem & {image: string, total: number}, index: number) => (
                    <tr key={index} className="border-t border-slate-200">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48x48?text=No+Image';
                            }}
                          />
                          <span className="font-medium text-sm">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-center font-medium">{item.quantity}</td>
                      <td className="p-3 text-right font-medium">{Number(item.total).toFixed(2)} сом</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t-2 border-slate-200 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Подытог:</span>
                <span className="font-medium">{subtotal.toFixed(2)} сом</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Доставка:</span>
                <span className="font-medium">
                  {shippingCost > 0 ? `${shippingCost.toFixed(2)} сом` : 'Бесплатно'}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-orange-600 pt-2 border-t border-slate-200">
                <span>Итого:</span>
                <span>{total.toFixed(2)} сом</span>
              </div>
            </div>
          </div>

          {currentOrderData.customer_note && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-slate-800 mb-2">Примечание к заказу:</h4>
              <p className="text-sm text-slate-600">{currentOrderData.customer_note}</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(currentOrderData.status)}`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                currentOrderData.status === 'completed' ? 'bg-green-600' :
                currentOrderData.status === 'processing' ? 'bg-blue-600' :
                currentOrderData.status === 'cancelled' ? 'bg-red-600' :
                'bg-yellow-600'
              }`}></div>
              <span className="font-medium">Статус: {getStatusText(currentOrderData.status)}</span>
            </div>
            {latestOrder && (
              <p className="text-xs text-slate-500 mt-2">Обновлено: {new Date().toLocaleTimeString()}</p>
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-200 p-4 bg-white">
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <FaPrint size={16} />
              Распечатать
            </button>
            <button
              onClick={handleShare}
              className="flex-1 bg-orange-100 text-orange-700 py-3 rounded-xl font-medium hover:bg-orange-200 transition-colors flex items-center justify-center gap-2"
            >
              <FaShare size={16} />
              Поделиться
            </button>
            <button
              onClick={onNewOrder}
              className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors"
            >
              Новый заказ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
