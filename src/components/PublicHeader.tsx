import { useState, useEffect, useMemo } from 'react';
import { useGetPublicProductCategoriesQuery } from '../app/services/publicApi';
import { Link } from 'react-router-dom';
import { HamburgerMenu } from './HamburgerMenu';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { openCart, openReceipts } from '../app/slices/uiSlice';
import { useScrollLockStore } from '../stores/scrollLockStore';
import { CategorySkeleton } from './Skeleton';
import { FaReceipt, FaFire } from 'react-icons/fa';

export const PublicHeader = () => {
  const dispatch = useAppDispatch();
  const { data: categories, isLoading } = useGetPublicProductCategoriesQuery({ per_page: 100 });
  const isScrollLocked = useScrollLockStore((s) => s.isLocked);
  const receipts = useAppSelector((s) => s.receipts.receipts);
  
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Проверяем, есть ли активные заказы (не завершенные и не отмененные)
  const hasActiveOrders = useMemo(() => {
    return receipts.some(
      (receipt) => receipt.status !== 'completed' && receipt.status !== 'cancelled'
    );
  }, [receipts]);

  const handleOpenReceipts = () => {
    dispatch(openReceipts());
  };

  // Отслеживаем прокрутку для подсветки активной категории
  useEffect(() => {
    const handleScroll = () => {
      const categorySections = document.querySelectorAll('[id^="category-"]');
      let activeCategory: number | null = null;

      categorySections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        // Если секция видна в верхней части экрана
        if (rect.top <= 100 && rect.bottom > 100) {
          const categoryId = section.id.replace('category-', '');
          activeCategory = Number(categoryId);
        }
      });

      if (activeCategory !== selectedCategory) {
        setSelectedCategory(activeCategory);
        // НЕ обновляем URL при скролле - только при клике на категорию
      }
    };

    if (!isScrollLocked) {
      window.addEventListener('scroll', handleScroll);
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedCategory, isScrollLocked]);

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId);
    // Прокручиваем к секции категории на главной странице
    setTimeout(() => {
      const categorySection = document.getElementById(`category-${categoryId}`);
      if (categorySection) {
        categorySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
    // НЕ обновляем URL при клике на категорию
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Верхняя часть хедера */}
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-black text-orange-600">BurgerFood</div>
          </Link>
          
          <div className="flex items-center gap-3">
            {/* Кнопка чеков с огненным эффектом при активных заказах */}
            <button
              onClick={handleOpenReceipts}
              className={`relative p-2 hover:bg-orange-50 rounded-lg transition-colors ${
                hasActiveOrders ? 'text-red-600' : 'text-orange-600'
              }`}
              title="Мои чеки"
            >
              <FaReceipt size={20} />
              {hasActiveOrders && (
                <div className="absolute -top-1 -right-1 animate-pulse">
                  <FaFire 
                    className="text-red-500 drop-shadow-lg" 
                    size={14}
                    style={{
                      filter: 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.9))'
                    }}
                  />
                </div>
              )}
            </button>
            
            <HamburgerMenu 
              onCartOpen={() => {
                dispatch(openCart());
              }} 
            />
          </div>
        </div>

        {/* Категории товаров */}
        <div className="border-t border-slate-200 py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {isLoading ? (
              <CategorySkeleton count={8} />
            ) : (
              categories?.filter((category: { id: number; name: string; slug: string }) => 
                category.name !== 'Без категории'
              ).map((category: { id: number; name: string; slug: string }) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all shrink-0 ${
                    selectedCategory === category.id
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {category.name}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

