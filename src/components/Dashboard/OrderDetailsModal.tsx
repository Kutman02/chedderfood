import { useState, useRef, useEffect } from 'react';
import { FaTimes, FaPhone, FaMapMarkerAlt, FaCalendar, FaCreditCard, FaTruck, FaShare, FaWhatsapp, FaTelegram, FaCopy, FaCheckCircle } from 'react-icons/fa';
import type { Order } from '../../types/types';
import { useToastStore } from '../../stores/toastStore';

interface OrderDetailsModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
}

export const OrderDetailsModal = ({ isOpen, order, onClose }: OrderDetailsModalProps) => {
  const showToast = useToastStore((state) => state.showToast);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  
  // Закрываем меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    };

    if (showShareMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareMenu]);
  
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

  const generateShareText = () => {
    const itemsText = order.line_items
      .map((item) => `• ${item.name} - ${item.quantity} шт. × ${item.price} ${order.currency} = ${item.total} ${order.currency}`)
      .join('\n');

    let text = `Заказ #${order.number}\n\n`;
    text += `Клиент: ${order.billing.first_name} ${order.billing.last_name}\n`;
    text += `Телефон: ${order.billing.phone}\n`;
    text += `Дата: ${formatDate(order.date_created)}\n\n`;
    text += `Адрес доставки:\n${order.billing.address_1}`;
    if (order.billing.address_2) {
      text += `\n${order.billing.address_2}`;
    }
    text += `\n${order.billing.city}, ${order.billing.postcode}\n\n`;
    text += `Товары:\n${itemsText}\n\n`;
    if (order.shipping_total && parseFloat(order.shipping_total) > 0) {
      text += `Доставка: ${order.shipping_total} ${order.currency}\n`;
    }
    text += `Итого: ${order.total} ${order.currency}`;
    if (order.payment_method_title) {
      text += `\nСпособ оплаты: ${order.payment_method_title}`;
    }
    if (order.customer_note) {
      text += `\n\nПримечание: ${order.customer_note}`;
    }
    return text;
  };

  const handleShare = async () => {
    // Предотвращаем множественные клики
    if (isSharing) return;
    
    const shareText = generateShareText();
    const shareTitle = `Заказ #${order.number}`;

    // Используем Web Share API, если доступен
    if ('share' in navigator) {
      setIsSharing(true);
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
        });
        setShowShareMenu(false);
        showToast('Детали заказа успешно отправлены', 'success');
      } catch (err: unknown) {
        // Пользователь отменил шаринг - не показываем ошибку
        const error = err as Error & { name?: string };
        if (error.name !== 'AbortError') {
          console.error('Share failed:', err);
          // Если это ошибка InvalidStateError, показываем сообщение
          if (error.name === 'InvalidStateError') {
            showToast('Пожалуйста, подождите завершения предыдущей операции', 'error');
          }
        }
      } finally {
        setIsSharing(false);
      }
    } else {
      // Fallback: показываем меню с опциями
      setShowShareMenu(true);
    }
  };

  const handleWhatsAppShare = () => {
    const shareText = generateShareText();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
    setShowShareMenu(false);
    showToast('Открыт WhatsApp для отправки', 'success');
  };

  const handleTelegramShare = () => {
    const shareText = generateShareText();
    const telegramUrl = `https://t.me/share/url?url=&text=${encodeURIComponent(shareText)}`;
    window.open(telegramUrl, '_blank');
    setShowShareMenu(false);
    showToast('Открыт Telegram для отправки', 'success');
  };

  const handleCopyToClipboard = async () => {
    const shareText = generateShareText();
    try {
      await navigator.clipboard.writeText(shareText);
      setShowShareMenu(false);
      showToast('Детали заказа скопированы в буфер обмена', 'success');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      showToast('Не удалось скопировать детали заказа', 'error');
    }
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
          <div className="flex items-center gap-2 relative">
            <div className="relative" ref={shareMenuRef}>
              <button
                onClick={() => {
                  if ('share' in navigator) {
                    handleShare();
                  } else {
                    setShowShareMenu(!showShareMenu);
                  }
                }}
                disabled={isSharing}
                className={`w-10 h-10 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center transition-colors ${
                  isSharing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title="Поделиться деталями заказа"
              >
                <FaShare />
              </button>
              
              {showShareMenu && (
                <div className="absolute right-0 top-12 bg-white shadow-2xl border-2 border-slate-200 rounded-xl p-2 z-50 min-w-200px animate-in slide-in-from-top-2 duration-200">
                  {'share' in navigator && (
                    <button
                      onClick={handleShare}
                      disabled={isSharing}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors text-left ${
                        isSharing ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <FaShare className="text-blue-600" />
                      <span className="font-semibold text-sm text-slate-900">Нативное меню</span>
                    </button>
                  )}
                  <button
                    onClick={handleWhatsAppShare}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 transition-colors text-left"
                  >
                    <FaWhatsapp className="text-green-600 text-lg" />
                    <span className="font-semibold text-sm text-slate-900">WhatsApp</span>
                  </button>
                  <button
                    onClick={handleTelegramShare}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors text-left"
                  >
                    <FaTelegram className="text-blue-500 text-lg" />
                    <span className="font-semibold text-sm text-slate-900">Telegram</span>
                  </button>
                  <button
                    onClick={handleCopyToClipboard}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors text-left"
                  >
                    <FaCopy className="text-slate-600" />
                    <span className="font-semibold text-sm text-slate-900">Копировать</span>
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <FaTimes />
            </button>
          </div>
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

          {/* Тип заказа */}
          {order.meta_data && order.meta_data.length > 0 && (() => {
            const orderTypeMeta = order.meta_data.find(m => m.key === 'order_type');
            if (orderTypeMeta) {
              const isPickup = orderTypeMeta.value === 'pickup';
              return (
                <div className={`rounded-xl p-4 border-2 ${
                  isPickup 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <h3 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
                    <FaCheckCircle className={isPickup ? 'text-green-600' : 'text-blue-600'} />
                    {isPickup ? 'Самовывоз' : 'Доставка'}
                  </h3>
                  <p className={`text-sm font-semibold ${
                    isPickup ? 'text-green-700' : 'text-blue-700'
                  }`}>
                    {isPickup 
                      ? 'Клиент заберет заказ в ресторане' 
                      : 'Доставка осуществляется по адресу'}
                  </p>
                </div>
              );
            }
            return null;
          })()}

          {/* Адрес доставки */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-600" /> Адрес
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

