import React, { useState, useLayoutEffect } from 'react';
import { FaTimes, FaMinus, FaPlus, FaTrash, FaShoppingBag } from 'react-icons/fa';
import { useGetProductsQuery } from '../app/services/api';
import { Checkout } from './Checkout';
import type { Product } from '../types/types';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addToCart, clearCart, removeFromCart } from '../app/slices/cartSlice';
import { closeCart, openReceipts } from '../app/slices/uiSlice';
import { useScrollLockStore } from '../stores/scrollLockStore';

export const Cart: React.FC = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((s) => s.cart.items);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const lockScroll = useScrollLockStore((s) => s.lock);
  const unlockScroll = useScrollLockStore((s) => s.unlock);
  const { data: products } = useGetProductsQuery({
    per_page: 100,
    status: 'publish',
  });

  // Блокируем прокрутку при открытии корзины (когда форма Checkout не открыта)
  useLayoutEffect(() => {
    if (!showCheckoutForm) {
      lockScroll();
      return () => {
        unlockScroll();
      };
    }
    // Когда открыта форма Checkout, блокировку контролирует сам Checkout
    return undefined;
  }, [showCheckoutForm, lockScroll, unlockScroll]);

  // Получаем товары в корзине с их данными
  const cartItems = products
    ? products
        .filter((product: Product) => cart[product.id] > 0)
        .map((product: Product) => ({
          ...product,
          quantity: cart[product.id],
          totalPrice: (parseFloat(product.sale_price || product.price || '0') * cart[product.id]).toFixed(0),
        }))
    : [];

  // Расчет общей суммы
  const totalAmount = cartItems.reduce((sum: number, item: Product & { quantity: number; totalPrice: string }) => sum + parseFloat(item.totalPrice), 0);
  const totalItems = cartItems.reduce((sum: number, item: Product & { quantity: number; totalPrice: string }) => sum + item.quantity, 0);

  const handleCheckout = () => {
    setShowCheckoutForm(true);
  };

  const handleCheckoutSuccess = () => {
    dispatch(clearCart());
    setShowCheckoutForm(false);
    // Показываем список чеков после успешного заказа
    dispatch(openReceipts());
  };

  const handleCheckoutBack = () => {
    setShowCheckoutForm(false);
  };

  if (showCheckoutForm) {
    return (
      <Checkout
        onClose={() => {
          dispatch(closeCart());
        }}
        onBack={handleCheckoutBack}
        onSuccess={handleCheckoutSuccess}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Кнопка закрытия вверху справа */}
      <button
        onClick={() => dispatch(closeCart())}
        className="fixed top-4 right-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all duration-300 ease-out active:scale-95"
      >
        <FaTimes size={20} />
      </button>

      {/* Заголовок корзины */}
      <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <FaShoppingBag className="text-orange-600" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">
              Корзина ({totalItems})
            </h2>
            <p className="text-sm text-slate-600">Ваши выбранные товары</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {cartItems.length > 0 && (
            <button
              onClick={() => dispatch(clearCart())}
              className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Очистить корзину"
            >
              <FaTrash size={18} />
            </button>
          )}
        </div>
      </div>

        {/* Контент корзины */}
        <div className="flex-1 overflow-y-auto p-6 pb-32">
          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <FaShoppingBag className="text-slate-400" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Корзина пуста</h3>
              <p className="text-slate-600 mb-8 text-lg">Добавьте товары для оформления заказа</p>
              <button
                onClick={() => dispatch(closeCart())}
                className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-700 transition-all duration-300 ease-out text-lg active:scale-95 shadow-lg hover:shadow-xl"
              >
                Перейти к покупкам
              </button>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto">
              {cartItems.map((item: Product & { quantity: number; totalPrice: string }) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 flex gap-6 hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-1"
                >
                  {/* Изображение товара */}
                  <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                    <img
                      src={item.images?.[0]?.src || '/placeholder-image.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96x96?text=No+Image';
                      }}
                    />
                  </div>

                  {/* Информация о товаре */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2 transition-colors hover:text-slate-700">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xl font-bold text-orange-600">
                        {item.sale_price || item.price} сом
                      </span>
                      {item.sale_price && item.regular_price && (
                        <span className="text-sm text-slate-400 line-through">
                          {item.regular_price} сом
                        </span>
                      )}
                    </div>

                    {/* Управление количеством */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-orange-50 rounded-lg p-2">
                        <button
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="w-10 h-10 flex items-center justify-center bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 active:scale-95"
                        >
                          <FaMinus size={14} />
                        </button>
                        <span className="font-bold text-lg text-slate-800 min-w-10 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => dispatch(addToCart(item.id))}
                          className="w-10 h-10 flex items-center justify-center bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 active:scale-95"
                        >
                          <FaPlus size={14} />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl text-slate-800">
                          {item.totalPrice} сом
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Футер с итоговой суммой */}
        {cartItems.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 p-6 bg-white shadow-lg">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold text-slate-800">Итого:</span>
                <span className="text-3xl font-black text-orange-600">{totalAmount} сом</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition-all duration-300 ease-out flex items-center justify-center gap-3 text-lg active:scale-95 shadow-lg hover:shadow-xl"
              >
                <FaShoppingBag size={20} />
                Оформить заказ
              </button>
            </div>
          </div>
        )}
    </div>
  );
};