import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { FaTimes, FaShoppingCart } from 'react-icons/fa';
import type { Product } from '../types/types';
import { useAppDispatch } from '../app/hooks';
import { addToCart } from '../app/slices/cartSlice';
import { useScrollLockStore } from '../stores/scrollLockStore';
import { useToastStore } from '../stores/toastStore';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModalSwipe: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const lockScroll = useScrollLockStore((s) => s.lock);
  const unlockScroll = useScrollLockStore((s) => s.unlock);
  const showToast = useToastStore((state) => state.showToast);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isImageDragging, setIsImageDragging] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!isOpen) return;
    lockScroll();
    return () => {
      unlockScroll();
    };
  }, [isOpen, lockScroll, unlockScroll]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen || !product) return null;

  // Сбрасываем индекс изображения при изменении товара
  const productImages = product.images || [];
  if (currentImageIndex >= productImages.length && productImages.length > 0) {
    setCurrentImageIndex(0);
  }

  const currentImage = productImages[currentImageIndex];
  const productImage = currentImage?.src || '/placeholder-image.jpg';
  const productPrice = product.sale_price || product.price || '0';

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex < productImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  // Обработчики свайпа для изображений
  const handleImageTouchStart = (e: React.TouchEvent) => {
    setIsImageDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleImageTouchMove = (e: React.TouchEvent) => {
    if (!isImageDragging) return;
    
    const currentTouchX = e.touches[0].clientX;
    setCurrentX(currentTouchX);
  };

  const handleImageTouchEnd = () => {
    if (!isImageDragging) return;
    
    const deltaX = startX - currentX;
    const swipeThreshold = 50;
    
    // Свайп влево - следующее изображение
    if (deltaX > swipeThreshold && currentImageIndex < productImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
    // Свайп вправо - предыдущее изображение
    else if (deltaX < -swipeThreshold && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
    
    setIsImageDragging(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Проверяем, что свайп начинается от верхней части модалки (первые 50px)
    const modalContent = modalRef.current;
    if (!modalContent) return;
    
    const touchY = e.touches[0].clientY;
    const modalRect = modalContent.getBoundingClientRect();
    const relativeY = touchY - modalRect.top;
    
    // Разрешаем свайп для закрытия только если начинаем от верхней части модалки
    if (relativeY <= 50) {
      setIsDragging(true);
      setStartY(e.touches[0].clientY);
      setCurrentY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentTouchY = e.touches[0].clientY;
    setCurrentY(currentTouchY);
    
    const deltaY = startY - currentTouchY;
    
    // Предотвращаем прокрутку страницы при свайпе для закрытия
    if (deltaY < 0) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const deltaY = startY - currentY;
    
    // Если свайпнули вниз достаточно сильно - закрываем
    if (deltaY < -100) {
      onClose();
    }
    
    setIsDragging(false);
  };

const SITE_URL = import.meta.env.VITE_SITE_URL;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transition-all duration-300 ease-out ${
          isDragging ? 'transition-none' : ''
        }`}
        style={{
          transform: isDragging 
            ? `translateY(${Math.max(0, currentY - startY)}px)` 
            : 'translateY(0)',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Заголовок с кнопкой закрытия - фиксированный */}
        <div className="shrink-0 flex items-center justify-between p-4 border-b border-slate-200 md:hidden">
          <h2 className="text-lg font-black text-slate-800 flex-1 pr-2">
            {product.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors rounded-lg shrink-0"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Прокручиваемый контент */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="flex flex-col md:flex-row h-full md:h-auto">
            {/* Левая часть - Изображение */}
            <div className="md:w-1/2 relative shrink-0">
              <div 
                className="aspect-square bg-slate-100"
                onTouchStart={handleImageTouchStart}
                onTouchMove={handleImageTouchMove}
                onTouchEnd={handleImageTouchEnd}
              >
                <img
                  src={productImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `${SITE_URL}/wp-content/uploads/2026/02/ChatGPT-Image-10-февр.-2026-г.-10_22_47.png`;
                  }}
                />
                
                {/* Навигационные стрелки */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      disabled={currentImageIndex === 0}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-full z-10"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={handleNextImage}
                      disabled={currentImageIndex === productImages.length - 1}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-full z-10"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
                
                {/* Индикатор текущего изображения */}
                {productImages.length > 1 && (
                  <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 text-sm font-bold rounded">
                    {currentImageIndex + 1} / {productImages.length}
                  </div>
                )}
              </div>
            </div>

            {/* Правая часть - Информация о товаре */}
            <div className="md:w-1/2 p-6 flex flex-col shrink-0">
              {/* Кнопка закрытия - только на десктопе */}
              <button
                onClick={onClose}
                className="hidden md:block self-end p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors rounded-lg mb-2"
              >
                <FaTimes size={20} />
              </button>

              {/* Название товара - только на десктопе */}
              <h2 className="hidden md:block text-2xl font-black text-slate-800 mb-4">
                {product.name}
              </h2>

              <div className="flex-1 space-y-4">
                {/* Цена */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-orange-600">
                    {productPrice} сом
                  </span>
                  {product.sale_price && product.regular_price && (
                    <span className="text-lg text-slate-400 line-through">
                      {product.regular_price} сом
                    </span>
                  )}
                </div>

                {/* Вес */}
                {product.weight && (
                  <div className="text-sm text-slate-600 font-medium">
                    Вес: {
                      typeof product.weight === 'string' 
                        ? (parseFloat(product.weight) >= 1000 ? `${(parseFloat(product.weight) / 1000).toFixed(1)} кг` : `${product.weight} г`)
                        : (product.weight >= 1000 ? `${(product.weight / 1000).toFixed(1)} кг` : `${product.weight} г`)
                    }
                  </div>
                )}

                {/* Состав */}
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-slate-800">Описание</h3>
                  <div className="text-slate-700 text-sm">
                    {product.description ? (
                      <div 
                        dangerouslySetInnerHTML={{ __html: product.description.replace(/<[^>]*>/g, '').split(',').map(ing => ing.trim()).join(', ') }}
                      />
                    ) : (
                      <div>
                        Мясо, томатный соус, моцарелла, огурцы маринованные, томаты, лук красный, халапеньо
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Кнопка добавления в корзину - фиксированная внизу на мобильных */}
              <div className="pt-4 pb-2 md:pb-0">
                <button
                  onClick={() => {
                    dispatch(addToCart(product.id));
                    showToast(`Вы добавили "${product.name}" в корзину`, 'success');
                    onClose();
                  }}
                  className="w-full bg-orange-600 text-white py-3 md:py-2.5 rounded-xl font-bold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 text-base shadow-lg"
                  disabled={product.stock_status !== 'instock'}
                >
                  <FaShoppingCart size={16} /> В корзину
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
