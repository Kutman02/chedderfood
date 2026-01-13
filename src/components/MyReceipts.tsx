import React, { useState, useLayoutEffect } from 'react';
import { FaTimes, FaTrash, FaReceipt, FaCalendarAlt, FaUser, FaPhone, FaMapMarkerAlt, FaEye, FaSync } from 'react-icons/fa';
import { OrderReceipt } from './OrderReceipt';
import { ConfirmDialog } from './ConfirmDialog';
import { useGetPublicOrderQuery } from '../app/services/publicApi';
import type { OrderItem, Product, ReceiptData } from '../types/types';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { deleteReceipt } from '../app/slices/receiptsSlice';
import { useScrollLockStore } from '../stores/scrollLockStore';

interface MyReceiptsProps {
  products: Product[];
  onClose: () => void;
}

export const MyReceipts: React.FC<MyReceiptsProps> = ({ products, onClose }) => {
  const dispatch = useAppDispatch();
  const receipts = useAppSelector((s) => s.receipts.receipts);
  const lockScroll = useScrollLockStore((s) => s.lock);
  const unlockScroll = useScrollLockStore((s) => s.unlock);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; receiptId: number | null }>({
    isOpen: false,
    receiptId: null,
  });

  // Блокируем прокрутку при открытии списка чеков
  useLayoutEffect(() => {
    if (!selectedReceipt) {
      lockScroll();
      return () => {
        unlockScroll();
      };
    }
  }, [selectedReceipt, lockScroll, unlockScroll]);

  const handleDeleteReceipt = (receiptId: number, status: string) => {
    // Разрешаем удаление только для завершенных или отмененных заказов
    if (status !== 'completed' && status !== 'cancelled') {
      return;
    }
    setDeleteConfirm({ isOpen: true, receiptId });
  };

  const confirmDeleteReceipt = () => {
    if (deleteConfirm.receiptId) {
      dispatch(deleteReceipt(deleteConfirm.receiptId));
    }
    setDeleteConfirm({ isOpen: false, receiptId: null });
  };

  const cancelDeleteReceipt = () => {
    setDeleteConfirm({ isOpen: false, receiptId: null });
  };

  // Компонент для отдельного чека с обновлением статуса
  const ReceiptItem: React.FC<{ receipt: ReceiptData }> = ({ receipt }) => {
    const { data: latestOrder, refetch } = useGetPublicOrderQuery(receipt.id.toString(), {
      pollingInterval: 15000, // Обновлять каждые 15 секунд
    });

    const currentOrderData = latestOrder || receipt;
    
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

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const handleViewReceipt = () => {
      setSelectedReceipt(receipt);
    };

    const handleRefresh = async () => {
      try {
        await refetch();
      } catch (err: unknown) {
        console.error('Error refreshing receipt:', err);
      }
    };

    // Проверяем, можно ли удалить чек (только для завершенных или отмененных)
    const canDeleteReceipt = currentOrderData.status === 'completed' || currentOrderData.status === 'cancelled';

    return (
      <div
        className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-1"
      >
        {/* Заголовок чека */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <FaReceipt className="text-orange-600" size={16} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Заказ #{receipt.id}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <FaCalendarAlt size={12} />
                {formatDate(receipt.date_created)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(currentOrderData.status)}`}>
              {getStatusText(currentOrderData.status)}
            </span>
            {latestOrder && (
              <button
                onClick={handleRefresh}
                className="p-1 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                title="Обновить статус"
              >
                <FaSync size={12} />
              </button>
            )}
            {canDeleteReceipt && (
              <button
                onClick={() => handleDeleteReceipt(receipt.id, currentOrderData.status)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Удалить чек"
              >
                <FaTrash size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Информация о клиенте */}
        <div className="mb-3 text-sm">
          <div className="flex items-center gap-2 text-slate-600 mb-1">
            <FaUser size={12} />
            <span className="truncate">{currentOrderData.billing.first_name}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 mb-1">
            <FaPhone size={12} />
            <span className="truncate">{currentOrderData.billing.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <FaMapMarkerAlt size={12} />
            <span className="truncate">{currentOrderData.billing.address_1}</span>
          </div>
        </div>

        {/* Товары */}
        <div className="mb-3">
          <div className="text-sm text-slate-600 mb-1">Товары ({currentOrderData.line_items.length}):</div>
          <div className="flex flex-wrap gap-1">
            {currentOrderData.line_items.slice(0, 3).map((item: OrderItem, index: number) => (
              <span
                key={index}
                className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs"
              >
                {item.name} x{item.quantity}
              </span>
            ))}
            {currentOrderData.line_items.length > 3 && (
              <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                +{currentOrderData.line_items.length - 3} еще
              </span>
            )}
          </div>
        </div>

        {/* Итоговая сумма */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-200">
          <span className="text-lg font-bold text-orange-600">
            {parseFloat(currentOrderData.total).toFixed(2)} сом
          </span>
          <div className="text-xs text-slate-500">
            {latestOrder && 'Обновлено: ' + new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Кнопка просмотра чека */}
        <div className="mt-3 pt-3 border-t border-slate-200">
          <button
            onClick={handleViewReceipt}
            className="w-full bg-orange-600 text-white py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <FaEye size={14} />
            Посмотреть чек
          </button>
        </div>
      </div>
    );
  };

  if (selectedReceipt) {
    return (
      <OrderReceipt
        orderData={selectedReceipt}
        products={products}
        onClose={() => setSelectedReceipt(null)}
        onNewOrder={() => setSelectedReceipt(null)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white animate-in fade-in slide-in-from-bottom-4 duration-300 flex flex-col h-screen">
      {/* Кнопка закрытия вверху справа */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all duration-300 ease-out active:scale-95"
      >
        <FaTimes size={20} />
      </button>

      {/* Заголовок */}
      <div className="shrink-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <FaReceipt className="text-orange-600" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">Мои чеки</h2>
            <p className="text-sm text-slate-600">История ваших заказов</p>
          </div>
        </div>
      </div>

        {/* Контент */}
        <div className="flex-1 overflow-y-auto p-6">
          {receipts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <FaReceipt className="text-slate-400" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">У вас пока нет чеков</h3>
              <p className="text-slate-600 mb-8 text-lg">После оформления заказы будут отображаться здесь</p>
              <button
                onClick={onClose}
                className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-700 transition-all duration-300 ease-out text-lg active:scale-95 shadow-lg hover:shadow-xl"
              >
                Перейти к покупкам
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {receipts.map((receipt) => (
                <ReceiptItem
                  key={receipt.id}
                  receipt={receipt}
                />
              ))}
            </div>
          )}
        </div>

      {/* Диалог подтверждения удаления чека */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Удаление чека"
        message={`Вы действительно хотите удалить чек #${deleteConfirm.receiptId}?`}
        onConfirm={confirmDeleteReceipt}
        onCancel={cancelDeleteReceipt}
        confirmText="Да"
        cancelText="Нет"
      />
    </div>
  );
};
