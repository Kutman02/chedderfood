import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaTimes, FaBars, FaReceipt, FaUser, FaPhone, FaMapMarkerAlt, FaShoppingCart, FaInfoCircle, FaAddressBook } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearCustomerData } from '../app/slices/receiptsSlice';
import { openReceipts, closeReceipts } from '../app/slices/uiSlice';
import { useScrollLockStore } from '../stores/scrollLockStore';
import { InstallAppButton } from '../components/InstallAppButton';


interface HamburgerMenuProps {
  onCustomerDataSelect?: (data: { first_name: string; phone: string; address: string }) => void;
  onCartOpen?: () => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ 
  onCustomerDataSelect,
  onCartOpen 
}) => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const isReceiptsOpen = useAppSelector((s) => s.ui.isReceiptsOpen);
  const customerData = useAppSelector((s) => s.receipts.customerData);
  const lockScroll = useScrollLockStore((s) => s.lock);
  const unlockScroll = useScrollLockStore((s) => s.unlock);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Блокируем прокрутку при открытии меню
  useLayoutEffect(() => {
    if (isOpen) {
      lockScroll();
      return () => {
        unlockScroll();
      };
    }
  }, [isOpen, lockScroll, unlockScroll]);

  // Определяем мобильное ли устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleOpenMenu = () => setIsOpen(true);
  const handleCloseMenu = () => setIsOpen(false);
  const handleOpenReceipts = () => {
    if (isReceiptsOpen) {
      // Если модальное окно уже открыто, закрываем его
      dispatch(closeReceipts());
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('modal');
      setSearchParams(newParams);
    } else {
      // Если модальное окно закрыто, открываем его
      dispatch(openReceipts());
      const newParams = new URLSearchParams(searchParams);
      newParams.set('modal', 'mycheks');
      setSearchParams(newParams);
    }
    handleCloseMenu();
  };

  const handleUseCustomerData = () => {
    if (customerData && onCustomerDataSelect) {
      onCustomerDataSelect(customerData);
      handleCloseMenu();
    }
  };

  const handleClearCustomerData = () => {
    if (window.confirm('Очистить сохраненные данные клиента?')) {
      dispatch(clearCustomerData());
      handleCloseMenu();
    }
  };

  // Для десктопа показываем горизонтальное меню
  if (!isMobile) {
    return (
      <>
        {/* Горизонтальное меню для десктопа */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenReceipts}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <FaReceipt size={14} />
            <span className="text-sm font-medium">Мои чеки</span>
          </button>
          <Link
            to="/about"
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <FaInfoCircle size={14} />
            <span className="text-sm font-medium">О нас</span>
          </Link>
          <Link
            to="/contacts"
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <FaAddressBook size={14} />
            <span className="text-sm font-medium">Контакты</span>
          </Link>
          <button
            onClick={onCartOpen}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <FaShoppingCart size={14} />
            <span className="text-sm font-medium">Корзина</span>
          </button>
        </div>

      </>
    );
  }

  return (
    <>
      {/* Кнопка гамбургера */}
      <button
        onClick={handleOpenMenu}
        className="p-2 text-slate-600 hover:text-orange-600 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <FaBars size={20} />
      </button>

      {/* Меню */}
      {isOpen && (
        <div className="fixed inset-0 z-100">
          {/* Фон с анимацией появления */}
          <div
            className="absolute inset-0 bg-black/50 animate-in fade-in duration-300"
            onClick={handleCloseMenu}
          />

          {/* Панель меню - полноэкранная на мобильных с анимацией */}
          <div 
            className="absolute top-0 right-0 bottom-0 bg-white w-full shadow-2xl animate-in slide-in-from-right duration-300 max-w-md flex flex-col"
            style={{ 
              height: '100dvh', // Dynamic viewport height для мобильных
              paddingTop: 'env(safe-area-inset-top)',
              paddingBottom: 'env(safe-area-inset-bottom)'
            }}
          >
            {/* Заголовок */}
            <div className="shrink-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-800">Меню</h2>
              <button
                onClick={handleCloseMenu}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Контент меню */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-6" style={{ WebkitOverflowScrolling: 'touch' }}>
              {/* Мои чеки */}
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 delay-100">
                <button
                  onClick={handleOpenReceipts}
                  className="w-full flex items-center gap-4 p-5 bg-orange-50 hover:bg-orange-100 rounded-2xl transition-all duration-200 text-left active:scale-[0.98] shadow-sm hover:shadow-md"
                >
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center shadow-lg">
                    <FaReceipt className="text-white" size={18} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-base">Мои чеки</h3>
                    <p className="text-sm text-slate-600">История заказов</p>
                  </div>
                </button>
              </div>

              {/* Сохраненные данные клиента */}
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 delay-200">
                <h3 className="font-bold text-slate-800 mb-4 text-base">Мои данные</h3>
                {customerData ? (
                  <div className="bg-slate-50 rounded-2xl p-5 shadow-sm">
                    <div className="space-y-3 text-sm mb-5">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                        <FaUser size={14} className="text-slate-400" />
                        <span className="text-slate-700 font-medium">{customerData.first_name}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                        <FaPhone size={14} className="text-slate-400" />
                        <span className="text-slate-700 font-medium">{customerData.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                        <FaMapMarkerAlt size={14} className="text-slate-400" />
                        <span className="text-slate-700 font-medium truncate">{customerData.address}</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {onCustomerDataSelect && (
                        <button
                          onClick={handleUseCustomerData}
                          className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors text-sm active:scale-[0.98] shadow-md"
                        >
                          Использовать
                        </button>
                      )}
                      <button
                        onClick={handleClearCustomerData}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors active:scale-[0.98] shadow-sm"
                        title="Очистить данные"
                      >
                        <FaTimes size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-2xl p-6 text-center shadow-sm">
                    <p className="text-sm text-slate-600 mb-3">Сохраненные данные отсутствуют</p>
                    <p className="text-xs text-slate-500">После первого заказа данные сохранятся автоматически</p>
                  </div>
                )}
              </div>
<InstallAppButton />
              {/* Ссылки на страницы */}
              <div className="border-t border-slate-200 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-300 delay-300">
                <h3 className="font-bold text-slate-800 mb-4 text-base">Информация</h3>
                <div className="space-y-3">
                  <Link
                    to="/about"
                    onClick={handleCloseMenu}
                    className="flex items-center gap-4 p-4 bg-white hover:bg-orange-50 rounded-2xl transition-all duration-200 text-left active:scale-[0.98] shadow-sm hover:shadow-md border border-slate-200"
                  >
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <FaInfoCircle className="text-orange-600" size={18} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 text-base">О нас</h3>
                      <p className="text-sm text-slate-600">Узнайте больше о BurgerFood</p>
                    </div>
                  </Link>

                  <Link
                    to="/contacts"
                    onClick={handleCloseMenu}
                    className="flex items-center gap-4 p-4 bg-white hover:bg-orange-50 rounded-2xl transition-all duration-200 text-left active:scale-[0.98] shadow-sm hover:shadow-md border border-slate-200"
                  >
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <FaAddressBook className="text-orange-600" size={18} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 text-base">Контакты</h3>
                      <p className="text-sm text-slate-600">Свяжитесь с нами</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* О приложении */}
              <div className="border-t border-slate-200 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-300 delay-400">
                <h3 className="font-bold text-slate-800 mb-4 text-base">О приложении</h3>
                <div className="space-y-2 text-sm text-slate-600 bg-slate-50 rounded-2xl p-5">
                  <p className="font-medium text-slate-700">BurgerFood - доставка вкусной еды</p>
                  <p>Версия: 1.0.0</p>
                  <p>© 2026 Все права защищены</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
