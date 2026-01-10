import React from 'react';
import { FaImage, FaTag, FaBox, FaEdit, FaFire, FaStar, FaGift, FaEyeSlash } from 'react-icons/fa';
import type { Product } from '../../types/types';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export const ProductCard = ({ product, onEdit, isDragging, dragHandleProps }: ProductCardProps) => {
  const imageUrl = product.images && product.images.length > 0 ? product.images[0].src : null;
  const stockStatus = product.stock_status === 'instock' ? 'В наличии' : 'Нет в наличии';
  const stockColor = product.stock_status === 'instock' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
  const isHidden = product.status === 'draft';

  // Определяем статус товара
  const getProductStatus = () => {
    const tags = product.tags || [];
    if (tags.some(t => t.slug === 'hit' || t.name.toLowerCase().includes('хит'))) {
      return { label: 'Хит продаж', icon: FaFire, color: 'from-red-500 to-red-600' };
    }
    if (tags.some(t => t.slug === 'new' || t.name.toLowerCase().includes('новинка'))) {
      return { label: 'Новинка', icon: FaStar, color: 'from-blue-500 to-blue-600' };
    }
    if (tags.some(t => t.slug === 'sale' || t.name.toLowerCase().includes('скидка'))) {
      return { label: 'Скидка', icon: FaGift, color: 'from-green-500 to-green-600' };
    }
    return null;
  };

  const status = getProductStatus();
  const StatusIcon = status?.icon;

  return (
    <div 
      className={`bg-white rounded-2xl shadow-md border-2 border-slate-200 p-4 md:p-5 transition-all duration-300 hover:shadow-lg active:scale-[0.98] ${
        isDragging ? 'opacity-50 cursor-move' : ''
      }`}
      {...dragHandleProps}
    >
      <div className="flex gap-3 md:gap-4">
        {/* Изображение товара */}
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 relative">
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <FaImage className="text-slate-400 text-xl md:text-2xl" />
          )}
          {status && StatusIcon && (
            <div className={`absolute top-1 left-1 bg-linear-gradient-to-r ${status.color} text-white px-2 py-1 rounded-lg text-[10px] md:text-xs font-black flex items-center gap-1 shadow-lg`}>
              <StatusIcon size={8} className="md:w-2.5 md:h-2.5" /> 
              <span className="hidden sm:inline">{status.label}</span>
            </div>
          )}
        </div>

        {/* Информация о товаре */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2 gap-2">
            <h3 className="text-base md:text-lg font-black text-slate-900 line-clamp-2 flex-1">{product.name}</h3>
            {onEdit && (
              <button
                onClick={() => onEdit(product)}
                className="p-2.5 md:p-2 text-slate-600 active:text-orange-600 active:bg-orange-50 md:hover:text-orange-600 md:hover:bg-orange-50 rounded-xl transition-colors shrink-0"
                title="Редактировать"
              >
                <FaEdit size={16} className="md:w-auto md:h-auto" />
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {product.categories && product.categories.length > 0 && (
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <FaTag size={10} /> {product.categories[0].name}
              </span>
            )}
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stockColor}`}>
              <FaBox size={10} className="inline mr-1" /> {stockStatus}
            </span>
            {isHidden && (
              <span className="text-xs font-bold px-2 py-1 rounded-lg bg-red-100 text-red-600 flex items-center gap-1">
                <FaEyeSlash size={10} /> Скрыт
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              {product.sale_price && product.sale_price !== product.regular_price ? (
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-lg md:text-xl font-black text-green-600">{product.sale_price} сом</span>
                  <span className="text-sm text-slate-400 line-through">{product.regular_price} сом</span>
                </div>
              ) : (
                <span className="text-lg md:text-xl font-black text-slate-900">{product.price || product.regular_price} сом</span>
              )}
              {product.weight && (
                <div className="text-xs text-slate-500 mt-1">
                  Вес: {
                    typeof product.weight === 'string' 
                      ? (parseFloat(product.weight) >= 1000 ? `${(parseFloat(product.weight) / 1000).toFixed(1)} кг` : `${product.weight} г`)
                      : (product.weight >= 1000 ? `${(product.weight / 1000).toFixed(1)} кг` : `${product.weight} г`)
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

