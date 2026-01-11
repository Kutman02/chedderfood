import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetPublicProductsQuery, useGetPublicProductCategoriesQuery } from '../app/services/publicApi';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addToCart as addToCartAction, removeFromCart as removeFromCartAction } from '../app/slices/cartSlice';
import { closeReceipts, openCart, openReceipts, closeCart } from '../app/slices/uiSlice';
import { PublicHeader } from '../components/PublicHeader';
import { PublicFooter } from '../components/PublicFooter';
import { Cart } from '../components/Cart';
import { ProductModalSwipe } from '../components/ProductModalSwipe';
import { MyReceipts } from '../components/MyReceipts';
import { ProductSkeleton } from '../components/Skeleton';
import type { Product, Category } from '../types/types';
import { FaShoppingCart, FaPlus, FaMinus, FaFire, FaStar, FaGift } from 'react-icons/fa';

const Home = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const cart = useAppSelector((s) => s.cart.items);
  const isCartOpen = useAppSelector((s) => s.ui.isCartOpen);
  const isReceiptsOpen = useAppSelector((s) => s.ui.isReceiptsOpen);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Функция для определения статуса товара
  const getProductStatus = (product: Product) => {
    const tags = product.tags || [];
    if (tags.some(t => t.slug === 'hit' || t.name.toLowerCase().includes('хит'))) {
      return { label: 'Хит продаж', icon: FaFire, color: 'from-red-500 to-red-600' };
    } else if (tags.some(t => t.slug === 'new' || t.name.toLowerCase().includes('новинка'))) {
      return { label: 'Новинка', icon: FaStar, color: 'from-blue-500 to-blue-600' };
    } else if (tags.some(t => t.slug === 'sale' || t.name.toLowerCase().includes('скидка'))) {
      return { label: 'Скидка', icon: FaGift, color: 'from-green-500 to-green-600' };
    }
    return null;
  };
  
  const { data: products, isLoading: productsLoading } = useGetPublicProductsQuery({
    per_page: 100,
    status: 'publish',
  });

  const { data: categories, isLoading: categoriesLoading } = useGetPublicProductCategoriesQuery({
    per_page: 100,
  });

  // Группировка товаров по категориям
  const productsByCategory = useMemo(() => {
    if (!products || !categories) return {};
    
    const grouped: { [categoryId: number]: Product[] } = {};
    
    // Инициализируем все категории пустыми массивами
    categories.forEach((category: Category) => {
      grouped[category.id] = [];
    });
    
    // Распределяем товары по категориям
    products.forEach((product: Product) => {
      if (product.categories && product.categories.length > 0) {
        // Берем первую категорию товара
        const firstCategory = product.categories[0];
        if (grouped[firstCategory.id]) {
          grouped[firstCategory.id].push(product);
        }
      }
    });
    
    // Сортируем товары внутри каждой категории по menu_order
    Object.keys(grouped).forEach(categoryId => {
      grouped[Number(categoryId)].sort((a: Product, b: Product) => {
        const orderA = a.menu_order || 0;
        const orderB = b.menu_order || 0;
        return orderA - orderB;
      });
    });
    
    return grouped;
  }, [products, categories]);

  const addToCart = (productId: number) => {
    dispatch(addToCartAction(productId));
  };

  const removeFromCart = (productId: number) => {
    dispatch(removeFromCartAction(productId));
  };

  const getCartCount = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  // Синхронизация URL с состоянием модальных окон
  useEffect(() => {
    const modal = searchParams.get('modal');
    const productId = searchParams.get('productId');
    
    if (modal === 'cart' && !isCartOpen) {
      dispatch(openCart());
    } else if ((modal === 'receipts' || modal === 'mycheks') && !isReceiptsOpen) {
      dispatch(openReceipts());
    } else if (modal === 'product' && productId && products) {
      const product = products.find((p: Product) => p.id === Number(productId));
      if (product && (!selectedProduct || selectedProduct.id !== product.id)) {
        // Синхронизация состояния с URL параметрами - это правильный паттерн
        setSelectedProduct(product);
        setIsModalOpen(true);
      }
    } else {
      // Закрываем модальные окна, если соответствующий параметр отсутствует в URL
      if ((!modal || (modal !== 'receipts' && modal !== 'mycheks')) && isReceiptsOpen) {
        dispatch(closeReceipts());
      }
      if ((!modal || modal !== 'product') && isModalOpen && selectedProduct) {
        setIsModalOpen(false);
        setSelectedProduct(null);
      }
      if ((!modal || modal !== 'cart') && isCartOpen) {
        dispatch(closeCart());
      }
    }
  }, [searchParams, dispatch, isCartOpen, isReceiptsOpen, isModalOpen, selectedProduct, products]);

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('modal', 'product');
    newParams.set('productId', product.id.toString());
    setSearchParams(newParams);
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('modal');
    newParams.delete('productId');
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen flex flex-col transition-opacity duration-300">
      <PublicHeader />
      
      <main className="flex-1">

        {/* Секция товаров по категориям */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {categoriesLoading || productsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <ProductSkeleton count={8} />
            </div>
          ) : !categories || categories.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-slate-400 text-lg animate-in fade-in slide-in-from-bottom-4 duration-300">Категории не найдены</div>
            </div>
          ) : (
            <div className="space-y-16">
              {categories.filter((category: Category) => category.name !== 'Без категории').map((category: Category, categoryIndex: number) => {
                const categoryProducts = productsByCategory[category.id] || [];
                if (categoryProducts.length === 0) return null;

                return (
                  <section 
                    key={category.id} 
                    id={`category-${category.id}`}
                    className={`scroll-mt-32 animate-in fade-in slide-in-from-bottom-4 duration-300 delay-${Math.min(categoryIndex * 100, 300)}`}
                  >
                    <h2 className="text-3xl font-black text-slate-800 mb-8 text-center transition-all duration-300 ease-out">
                      {category.name}
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {categoryProducts.map((product: Product, productIndex: number) => {
                        const productImage = product.images?.[0]?.src || '/placeholder-image.jpg';
                        const productPrice = product.sale_price || product.price || '0';
                        const cartCount = cart[product.id] || 0;
                        
                        let discountPercent: number | null = null;
                        if (product.sale_price && product.regular_price) {
                          const regular = parseFloat(product.regular_price);
                          const sale = parseFloat(product.sale_price);
                          if (Number.isFinite(regular) && regular > 0 && Number.isFinite(sale) && sale < regular) {
                            discountPercent = Math.round((1 - sale / regular) * 100);
                          }
                        }
                        const isOutOfStock = product.stock_status && product.stock_status !== 'instock';
                        const productTags = product.tags?.slice(0, 2) ?? [];
                        const productStatus = getProductStatus(product);
                        const StatusIcon = productStatus?.icon;
                        const staggerClass = `animate-stagger-${(productIndex % 4) + 1}`;

                        return (
                          <div
                            key={product.id}
                            className={`shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 ${staggerClass} transition-all duration-300 ease-out`}
                            onClick={() => openProductModal(product)}
                          >
                            {/* Изображение товара */}
                            <div className="relative w-full aspect-square bg-slate-100 overflow-hidden rounded-2xl shadow-md transition-all duration-300 ease-out">
                              <img
                                src={productImage}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                                }}
                              />

                              {(discountPercent !== null || productStatus || isOutOfStock) && (
                                <div className="absolute top-2 left-2 flex flex-col gap-1">
                                  {productStatus && (
                                    <div className={`bg-linear-to-r ${productStatus.color} text-white px-2 py-1 rounded text-[11px] font-bold animate-in zoom-in-95 duration-200 shadow flex items-center gap-1`}>
                                      {StatusIcon && <StatusIcon size={10} />}
                                      {productStatus.label}
                                    </div>
                                  )}
                                  {discountPercent !== null && !productStatus && (
                                    <div className="bg-green-600 text-white px-2 py-1 rounded text-[11px] font-bold animate-in zoom-in-95 duration-200 shadow">
                                      Скидка -{discountPercent}%
                                    </div>
                                  )}
                                  {isOutOfStock && (
                                    <div className="bg-red-600 text-white px-2 py-1 rounded text-[11px] font-bold animate-in zoom-in-95 duration-200 shadow">
                                      Нет в наличии
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {/* Кнопка управления корзиной */}
                              <div 
                                className="absolute bottom-2 right-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {cartCount === 0 ? (
                                  <div 
                                    className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform duration-200 cursor-pointer active:scale-95"
                                    onClick={() => addToCart(product.id)}
                                  >
                                    <FaPlus className="text-orange-500" size={14} />
                                  </div>
                                ) : (
                                  <div className="bg-white rounded-full shadow-md flex items-center gap-1 px-1 py-1 animate-in zoom-in-95 duration-200">
                                    <button
                                      onClick={() => removeFromCart(product.id)}
                                      className="w-6 h-6 flex items-center justify-center hover:bg-orange-50 rounded-full transition-colors duration-200 active:scale-95"
                                    >
                                      <FaMinus className="text-orange-500" size={10} />
                                    </button>
                                    <span className="text-sm font-bold text-black min-w-5 text-center">
                                      {cartCount}
                                    </span>
                                    <button
                                      onClick={() => addToCart(product.id)}
                                      className="w-6 h-6 flex items-center justify-center hover:bg-orange-50 rounded-full transition-colors duration-200 active:scale-95"
                                    >
                                      <FaPlus className="text-orange-500" size={10} />
                                    </button>
                                  </div>
                                )}
                              </div>
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
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Плавающая кнопка корзины */}
      {getCartCount() > 0 && (
        <div className="fixed bottom-6 right-6 z-40 animate-in zoom-in-95 duration-400">
          <button 
            onClick={() => {
              if (isCartOpen) {
                dispatch(closeCart());
                const newParams = new URLSearchParams(searchParams);
                newParams.delete('modal');
                setSearchParams(newParams);
              } else {
                dispatch(openCart());
                const newParams = new URLSearchParams(searchParams);
                newParams.set('modal', 'cart');
                setSearchParams(newParams);
              }
            }}
            className="bg-orange-600 text-white px-6 py-4 rounded-full shadow-xl hover:bg-orange-700 hover:shadow-2xl transition-all duration-300 ease-out flex items-center gap-3 font-bold active:scale-95 border-2 border-white"
          >
            <FaShoppingCart className="animate-pulse" />
            <span className="bg-white text-orange-600 px-2 py-1 rounded-full text-sm font-bold">
              {getCartCount()}
            </span>
          </button>
        </div>
      )}

      <PublicFooter />

      {/* Модальное окно товара */}
      <ProductModalSwipe
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeProductModal}
      />

      {/* Список чеков */}
      {isReceiptsOpen && (
        <MyReceipts
          products={products || []}
          onClose={() => {
            dispatch(closeReceipts());
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('modal');
            setSearchParams(newParams);
          }}
        />
      )}

      {/* Корзина */}
      {isCartOpen && (
        <Cart />
      )}
    </div>
  );
};

export default Home;

