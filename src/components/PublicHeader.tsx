import { useState, useEffect, useMemo } from 'react';
import { useGetPublicProductCategoriesQuery } from '../app/services/publicApi';
import { Link, useSearchParams } from 'react-router-dom';
import { HamburgerMenu } from './HamburgerMenu';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { openCart, openReceipts, closeCart, closeReceipts } from '../app/slices/uiSlice';
import { useScrollLockStore } from '../stores/scrollLockStore';
import { CategorySkeleton } from './Skeleton';
import { FaReceipt} from 'react-icons/fa';


export const PublicHeader = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const isReceiptsOpen = useAppSelector((s) => s.ui.isReceiptsOpen);
  const isCartOpen = useAppSelector((s) => s.ui.isCartOpen);
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
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Верхняя часть хедера - компактная */}
        <div className="flex items-center justify-between py-2.5">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-xl font-black text-orange-600">BurgerFood</div>
          </Link>
          
          <div className="flex items-center gap-2">
            {/* Кнопка чеков с огненным эффектом при активных заказах */}
            <button
  onClick={handleOpenReceipts}
  className="relative p-1 rounded-lg hover:bg-orange-50/80 text-orange-600"
>
  {hasActiveOrders && (
    <span className="absolute -inset-1.5 rounded-full border-3 border-orange-400/30 border-t-orange-600 animate-spin-slow" />
  )}

  <FaReceipt size={18} className="relative z-10" />
</button>



            
            <HamburgerMenu 
              onCartOpen={() => {
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
            />
          </div>
        </div>

        {/* Категории товаров - прозрачные */}
        <div className="border-t border-slate-200/50 py-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {isLoading ? (
              <CategorySkeleton count={8} />
            ) : (
              categories?.filter((category: { id: number; name: string; slug: string }) => 
                category.name !== 'Без категории'
              ).map((category: { id: number; name: string; slug: string }) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`px-3 py-1.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-all shrink-0 ${
                    selectedCategory === category.id
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                      : 'bg-white/60 text-slate-700 hover:bg-white/80 backdrop-blur-sm border border-slate-200/50'
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

