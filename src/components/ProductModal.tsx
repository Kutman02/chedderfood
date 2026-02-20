import React from 'react';
import { FaTimes, FaShoppingCart } from 'react-icons/fa';
import type { Product } from '../types/types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (productId: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!isOpen || !product) return null;

  const productImage = product.images?.[0]?.src || '/placeholder-image.jpg';
  const productPrice = product.sale_price || product.price || '0';

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
const SITE_URL = import.meta.env.VITE_SITE_URL;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-20 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Заголовок модального окна */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-800">
            {product.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Контент модального окна */}
        <div className="grid md:grid-cols-2 gap-0">
          {/* Изображение товара */}
          <div className="relative bg-slate-100">
            <div className="aspect-square">
              <img
                src={productImage}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `${SITE_URL}/wp-content/uploads/2026/02/ChatGPT-Image-10-февр.-2026-г.-10_22_47.png`;
                }}
              />
            </div>
            {product.sale_price && product.regular_price && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-bold">
                Скидка
              </div>
            )}
          </div>

          {/* Информация о товаре */}
          <div className="p-6 space-y-4">
            {/* Размер и тип теста */}

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

            {/* Состав */}
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-slate-800">Описание</h3>
              <div className="text-slate-700 space-y-1">
                {product.description ? (
                  <div 
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: product.description.replace(/<[^>]*>/g, '').split(',').map(ing => ing.trim()).join(', ') }}
                  />
                ) : (
                  <div className="text-sm text-slate-600">
                    Мясо, томатный соус, моцарелла, огурцы маринованные, томаты, лук красный, халапеньо
                  </div>
                )}
              </div>
            </div>

            {/* Кнопка добавления в корзину */}
            <div className="pt-4">
              <button
                onClick={() => onAddToCart(product.id)}
                className="w-full bg-orange-600 text-white py-4 rounded-xl font-black hover:bg-orange-700 transition-colors flex items-center justify-center gap-3 text-lg"
                disabled={product.stock_status !== 'instock'}
              >
                <FaShoppingCart /> В корзину за {productPrice} сом
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
