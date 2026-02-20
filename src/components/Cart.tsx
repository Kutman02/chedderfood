import React, { useState, useLayoutEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaTimes, FaMinus, FaPlus, FaTrash, FaShoppingBag } from 'react-icons/fa';
import { useGetProductsQuery } from '../app/services/api';
import { Checkout } from './Checkout';
import type { Product } from '../types/types';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addToCart, clearCart, removeFromCart } from '../app/slices/cartSlice';
import { closeCart, openReceipts } from '../app/slices/uiSlice';
import { useScrollLockStore } from '../stores/scrollLockStore';


export const Cart: React.FC = () => {
  const SITE_URL = import.meta.env.VITE_SITE_URL;
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const cart = useAppSelector((s) => s.cart.items);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const lockScroll = useScrollLockStore((s) => s.lock);
  const unlockScroll = useScrollLockStore((s) => s.unlock);
  const { data: products, isLoading: productsLoading } = useGetProductsQuery({
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

  const handleCloseCart = () => {
    dispatch(closeCart());
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('modal');
    setSearchParams(newParams);
  };

  if (showCheckoutForm) {
    return (
      <Checkout
        onClose={handleCloseCart}
        onBack={handleCheckoutBack}
        onSuccess={handleCheckoutSuccess}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white animate-in fade-in slide-in-from-bottom-4 duration-300 flex flex-col h-100dvh safe-area-inset">
      {/* Кнопка закрытия вверху справа */}
      <button
        onClick={handleCloseCart}
        className="fixed top-3 right-3 md:top-4 md:right-4 z-10 w-9 h-9 md:w-10 md:h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all duration-300 ease-out active:scale-95"
      >
        <FaTimes size={18} />
      </button>

      {/* Заголовок корзины */}
      <div className="shrink-0 bg-white border-b border-slate-200 px-4 py-3 md:p-6 flex items-center justify-between safe-area-top">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
            <FaShoppingBag className="text-orange-600" size={20} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800">
              Корзина ({totalItems})
            </h2>
            <p className="text-xs md:text-sm text-slate-600 hidden sm:block">Ваши выбранные товары</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {cartItems.length > 0 && (
            <button
              onClick={() => dispatch(clearCart())}
              className="p-2 md:p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Очистить корзину"
            >
              <FaTrash size={16} />
            </button>
          )}
        </div>
      </div>

        {/* Контент корзины */}
        <div className="flex-1 overflow-y-auto px-4 py-4 md:p-6 pb-32 md:pb-6">
          {productsLoading ? (
            <div className="text-center py-12 md:py-20">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 relative">
                <FaShoppingBag className="text-orange-600" size={36} />
                <div className="absolute inset-0 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2 md:mb-3">Загрузка...</h3>
              <p className="text-slate-600 text-base md:text-lg">Загружаем товары из корзины</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-12 md:py-20">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 animate-pulse">
                <FaShoppingBag className="text-slate-400" size={36} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2 md:mb-3">Корзина пуста</h3>
              <p className="text-slate-600 mb-6 md:mb-8 text-base md:text-lg">Добавьте товары для оформления заказа</p>
              <button
                onClick={handleCloseCart}
                className="bg-orange-600 text-white px-6 py-2.5 md:px-8 md:py-3 rounded-lg md:rounded-xl font-bold hover:bg-orange-700 transition-all duration-300 ease-out text-base md:text-lg active:scale-95 shadow-lg hover:shadow-xl"
              >
                Перейти к покупкам
              </button>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4 max-w-4xl mx-auto">
              {cartItems.map((item: Product & { quantity: number; totalPrice: string }) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-xl md:rounded-2xl p-3 md:p-4 flex gap-3 md:gap-4 hover:shadow-lg transition-all duration-300 ease-out"
                >
                  {/* Изображение товара */}
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-100 rounded-lg md:rounded-xl overflow-hidden shrink-0">
                    <img
                      src={item.images?.[0]?.src || '/placeholder-image.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `${SITE_URL}/wp-content/uploads/2026/02/ChatGPT-Image-10-февр.-2026-г.-10_22_47.png`;
                      }}
                    />
                  </div>

                  {/* Информация о товаре */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <h3 className="font-bold text-base md:text-lg text-slate-800 mb-1 md:mb-2 line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                      <span className="text-lg md:text-xl font-bold text-orange-600">
                        {item.sale_price || item.price} сом
                      </span>
                      {item.sale_price && item.regular_price && (
                        <span className="text-xs md:text-sm text-slate-400 line-through">
                          {item.regular_price} сом
                        </span>
                      )}
                    </div>

                    {/* Управление количеством и итоговая цена */}
                    <div className="flex items-center justify-between mt-auto gap-2">
                      <div className="flex items-center gap-1.5 md:gap-2 bg-orange-50 rounded-lg p-1 md:p-1.5">
                        <button
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-orange-600 text-white rounded-md md:rounded-lg hover:bg-orange-700 transition-colors duration-200 active:scale-95"
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="font-bold text-base md:text-lg text-slate-800 min-w-24px md:min-w-28px text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => dispatch(addToCart(item.id))}
                          className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-orange-600 text-white rounded-md md:rounded-lg hover:bg-orange-700 transition-colors duration-200 active:scale-95"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-base md:text-lg text-slate-800 whitespace-nowrap">
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
          <div className="shrink-0 border-t border-slate-200 px-4 py-4 md:p-6 bg-white shadow-lg safe-area-bottom relative z-20">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <span className="text-lg md:text-xl font-bold text-slate-800">Итого:</span>
                <span className="text-2xl md:text-3xl font-black text-orange-600">{totalAmount} сом</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-orange-600 text-white py-3 md:py-3 rounded-lg md:rounded-xl font-bold hover:bg-orange-700 transition-all duration-300 ease-out flex items-center justify-center gap-2 md:gap-3 text-base md:text-lg active:scale-95 shadow-lg hover:shadow-xl"
              >
                <FaShoppingBag size={18} />
                Далее
              </button>
            </div>
          </div>
        )}
    </div>
  );
};