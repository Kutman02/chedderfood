import React from 'react';
import { FaImage, FaEdit, FaFire, FaStar, FaGift, FaEyeSlash } from 'react-icons/fa';
import type { Product } from '../../types/types';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export const ProductCard = ({ product, onEdit, isDragging, dragHandleProps }: ProductCardProps) => {
  const imageUrl = product.images && product.images.length > 0 ? product.images[0].src : null;
  const isHidden = product.status === 'draft';
  const isOutOfStock = product.stock_status && product.stock_status !== 'instock';
  const productPrice = product.sale_price || product.price || '0';

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

  // Рассчитываем процент скидки
  let discountPercent: number | null = null;
  if (product.sale_price && product.regular_price) {
    const regular = parseFloat(product.regular_price);
    const sale = parseFloat(product.sale_price);
    if (Number.isFinite(regular) && regular > 0 && Number.isFinite(sale) && sale < regular) {
      discountPercent = Math.round((1 - sale / regular) * 100);
    }
  }

  const productTags = product.tags?.slice(0, 2) ?? [];

  return (
    <div 
      className={`shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 flex flex-col transition-all duration-300 ease-out ${
        isDragging ? 'opacity-50 cursor-move' : ''
      }`}
      {...dragHandleProps}
    >
      {/* Изображение товара */}
      <div className="relative w-full aspect-square bg-slate-100 overflow-hidden rounded-2xl shadow-md transition-all duration-300 ease-out">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://cm328695-wordpress-da5gp.tw1.ru/wp-content/uploads/2026/01/7c37a436b7677921ef8d6256cd482ffb1509cf54-1120x1120-1.webp';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FaImage className="text-slate-400 text-4xl" />
          </div>
        )}

        {(discountPercent !== null || status || isOutOfStock || isHidden) && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {status && StatusIcon && (
              <div className={`bg-linear-to-r ${status.color} text-white px-2 py-1 rounded text-[11px] font-bold animate-in zoom-in-95 duration-200 shadow flex items-center gap-1`}>
                <StatusIcon size={10} />
                {status.label}
              </div>
            )}
            {discountPercent !== null && !status && (
              <div className="bg-green-600 text-white px-2 py-1 rounded text-[11px] font-bold animate-in zoom-in-95 duration-200 shadow">
                Скидка -{discountPercent}%
              </div>
            )}
            {isOutOfStock && (
              <div className="bg-red-600 text-white px-2 py-1 rounded text-[11px] font-bold animate-in zoom-in-95 duration-200 shadow">
                Нет в наличии
              </div>
            )}
            {isHidden && (
              <div className="bg-orange-600 text-white px-2 py-1 rounded text-[11px] font-bold animate-in zoom-in-95 duration-200 shadow flex items-center gap-1">
                <FaEyeSlash size={10} />
                Скрыт
              </div>
            )}
          </div>
        )}

        {/* Кнопка редактирования */}
        {onEdit && (
          <div className="absolute top-2 right-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(product);
              }}
              className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform duration-200 cursor-pointer active:scale-95"
              title="Редактировать"
            >
              <FaEdit className="text-orange-500" size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Контент карточки */}
      <div className="p-3 transition-all duration-300 ease-out">
        {/* Цена */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl font-bold text-orange-500 transition-colors hover:text-orange-600">
            {productPrice} сом
          </span>
          {product.sale_price && product.regular_price && (
            <span className="text-sm text-slate-400 line-through">
              {product.regular_price} сом
            </span>
          )}
        </div>

        {/* Название */}
        <h3 className="font-bold text-sm text-black mb-1 line-clamp-2 transition-colors hover:text-slate-700">
          {product.name}
        </h3>

        {productTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1">
            {productTags.map((tag) => (
              <span
                key={tag.id}
                className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Мета-данные */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          {product.weight && (
            <span>
              {typeof product.weight === 'string' 
                ? (parseFloat(product.weight) >= 1000 ? `${(parseFloat(product.weight) / 1000).toFixed(1)} кг` : `${product.weight} г`)
                : (product.weight >= 1000 ? `${(product.weight / 1000).toFixed(1)} кг` : `${product.weight} г`)
              }
            </span>
          )}
          {product.categories && product.categories.length > 0 && (
            <span>{product.weight ? '• ' : ''}{product.categories[0].name}</span>
          )}
        </div>
      </div>
    </div>
  );
};
