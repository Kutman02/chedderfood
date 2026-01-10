import { useState, useMemo } from 'react';
import { useGetProductsQuery, useGetProductCategoriesQuery, useUpdateOrderStatusMutation, useUpdateProductOrderMutation } from '../app/services/api';
import { useGetWooOrdersQuery, useGetWooCustomersQuery } from '../app/services/wooCommerceApi';
import { useAppSelector } from '../app/hooks';
import { useAuth } from '../hooks/useAuth';
import { FaBell, FaUserTie, FaCheckCircle, FaTimes, FaBox, FaUsers, FaShoppingBag, FaShoppingCart, FaPlus, FaGripVertical, FaArrowUp, FaArrowDown, FaEye, FaEyeSlash, FaDollarSign } from 'react-icons/fa';
import type { TabConfig, Product, Customer, Order } from '../types/types';
import { filterOrders } from '../utils/utils';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

// Type guard function to check if error is FetchBaseQueryError with status 401
const isAuthenticationError = (error: FetchBaseQueryError | SerializedError | undefined): boolean => {
  // SerializedError doesn't have status property, so we need to check if it's FetchBaseQueryError
  return !!(error && 'status' in error && (
    error.status === 401 || 
    (typeof error.data === 'object' && error.data !== null && 'status' in error.data && (error.data as { status?: number }).status === 401)
  ));
};

import { Header } from '../components/Dashboard/Header';
import { OrderCard } from '../components/Dashboard/OrderCard';
import { ProductCard } from '../components/Dashboard/ProductCard';
import { CustomerCard } from '../components/Dashboard/CustomerCard';
import { OrderDetailsModal } from '../components/Dashboard/OrderDetailsModal';
import { AddProductModal } from '../components/Dashboard/AddProductModal';
import { EditProductModal } from '../components/Dashboard/EditProductModal';
import { StatsModal } from '../components/Dashboard/StatsModal';

const ORDER_TABS: TabConfig[] = [
  { id: 'on-hold', label: 'Новые', icon: FaBell, color: 'from-amber-500 to-orange-500', bgColor: 'bg-amber-50', textColor: 'text-amber-700', borderColor: 'border-amber-200' },
  { id: 'processing', label: 'В работе', icon: FaUserTie, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-200' },
  { id: 'completed', label: 'Готовые', icon: FaCheckCircle, color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200' },
  { id: 'cancelled', label: 'Отмена', icon: FaTimes, color: 'from-red-500 to-red-600', bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200' },
];

const MAIN_SECTIONS = [
  { id: 'orders', label: 'Заказы', icon: FaShoppingBag, color: 'from-orange-500 to-orange-600' },
  { id: 'products', label: 'Товары', icon: FaBox, color: 'from-blue-500 to-blue-600' },
  { id: 'customers', label: 'Клиенты', icon: FaUsers, color: 'from-purple-500 to-purple-600' },
];

const Dashboard = () => {
  const userName = useAppSelector((s) => s.auth.userName);
  const { loading: authLoading, isAuthenticated } = useAuth();
  const [mainSection, setMainSection] = useState('orders');
  const [activeTab, setActiveTab] = useState('on-hold');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());
  const [removingOrderIds, setRemovingOrderIds] = useState<Set<number>>(new Set());
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Состояние для встроенного подтверждения в карточке заказа
  const [expandedConfirmation, setExpandedConfirmation] = useState<{
    orderId: number | null;
    action: string | null;
  }>({
    orderId: null,
    action: null,
  });
  
  const [orderDetailsModal, setOrderDetailsModal] = useState<{
    isOpen: boolean;
    order: Order | null;
  }>({
    isOpen: false,
    order: null,
  });

  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<number | null>(null);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'publish' | 'draft'>('all');
  const [draggedProductId, setDraggedProductId] = useState<number | null>(null);
  const [customerSortBy, setCustomerSortBy] = useState<'orders' | 'spent'>('orders');
  
  const { data: categories } = useGetProductCategoriesQuery({ per_page: 100 }, { skip: mainSection !== 'products' });
  const [updateProductOrder] = useUpdateProductOrderMutation();

  // Запросы данных
  const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useGetWooOrdersQuery(
    { status: activeTab, per_page: 100 },
    { pollingInterval: mainSection === 'orders' ? 15000 : 0, skip: mainSection !== 'orders' }
  );
  const { data: productsData, isLoading: productsLoading } = useGetProductsQuery(
    { search: searchQuery, per_page: 100, status: selectedStatusFilter === 'all' ? undefined : selectedStatusFilter },
    { skip: mainSection !== 'products' }
  );
  const { data: customersData, isLoading: customersLoading, error: customersError } = useGetWooCustomersQuery(
    { per_page: 100 },
    { skip: mainSection !== 'customers' }
  );

  // Debug logging for customers
  console.log('Customers Debug:', {
    mainSection,
    customersLoading,
    customersData,
    customersError,
    customersCount: customersData?.length || 0
  });

  const [updateStatus] = useUpdateOrderStatusMutation();

  const orders = filterOrders(ordersData, searchQuery);
  
  // Фильтрация товаров по категории и статусу
  const products = useMemo(() => {
    const allProducts = productsData || [];
    let filteredProducts = allProducts;
    
    // Фильтрация по категории
    if (selectedCategoryFilter) {
      filteredProducts = filteredProducts.filter((product: Product) => 
        product.categories?.some(cat => cat.id === selectedCategoryFilter)
      );
    }
    
    return filteredProducts;
  }, [productsData, selectedCategoryFilter]);
  
  // Сортировка товаров по menu_order
  const sortedProducts = useMemo(() => {
    return [...products].sort((a: Product, b: Product) => {
      const orderA = a.menu_order || 0;
      const orderB = b.menu_order || 0;
      return orderA - orderB;
    });
  }, [products]);
  
  const customers = useMemo(() => {
    if (!customersData) return [];
    
    if (!searchQuery.trim()) return customersData;
    
    const query = searchQuery.toLowerCase().trim();
    
    return customersData.filter((customer: Customer) => {
      const fullName = `${customer.first_name} ${customer.last_name}`.toLowerCase();
      const phone = customer.billing?.phone?.toLowerCase() || '';
      const address = customer.billing?.address_1?.toLowerCase() || '';
      const city = customer.billing?.city?.toLowerCase() || '';
      const username = customer.username?.toLowerCase() || '';
      
      // Умный поиск: ищем по имени, телефону, адресу, нику
      return (
        fullName.includes(query) ||
        phone.includes(query) ||
        address.includes(query) ||
        city.includes(query) ||
        username.includes(query) ||
        // Частичное совпадение для имен (кут найдет кутман, кутманбек)
        query.split(' ').some((word: string) => 
          word.length > 2 && (
            fullName.includes(word) ||
            word.includes(fullName.substring(0, Math.min(word.length, fullName.length))) ||
            fullName.includes(word.substring(0, Math.min(word.length, fullName.length)))
          )
        )
      );
    });
  }, [customersData, searchQuery]);
  
  const filteredCustomers = useMemo(() => {
    return [...customers].sort((a: Customer, b: Customer) => {
      if (customerSortBy === 'orders') {
        return (b.orders_count || 0) - (a.orders_count || 0);
      } else {
        const spentA = parseFloat(a.total_spent || '0');
        const spentB = parseFloat(b.total_spent || '0');
        return spentB - spentA;
      }
    });
  }, [customers, customerSortBy]);
  
  const activeTabData = ORDER_TABS.find(t => t.id === activeTab);

  const handleStatusUpdate = async (id: number, status: string) => {
    setProcessingIds(prev => new Set(prev).add(id));
    try {
      await updateStatus({ id, status }).unwrap();
      if (['processing', 'completed'].includes(status)) {
        setRemovingOrderIds(prev => new Set(prev).add(id));
        setTimeout(() => setRemovingOrderIds(prev => {
          const n = new Set(prev); n.delete(id); return n;
        }), 600);
      }
      // Закрываем подтверждение
      setExpandedConfirmation({ orderId: null, action: null });
    } catch {
      alert("Ошибка при обновлении");
    } finally {
      setProcessingIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    }
  };

  const handleConfirmAction = (orderId: number, _status: string, action: string) => {
    if (action) {
      // Показываем встроенное подтверждение в карточке
      setExpandedConfirmation({
        orderId,
        action,
      });
    } else {
      // Закрываем подтверждение
      setExpandedConfirmation({
        orderId: null,
        action: null,
      });
    }
  };

  const handleViewDetails = (order: Order) => {
    setOrderDetailsModal({
      isOpen: true,
      order,
    });
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowEditProductModal(true);
  };

  const handleDragStart = (e: React.DragEvent, productId: number) => {
    setDraggedProductId(productId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetProductId: number) => {
    e.preventDefault();
    if (!draggedProductId || draggedProductId === targetProductId) return;

    const draggedIndex = sortedProducts.findIndex((p: Product) => p.id === draggedProductId);
    const targetIndex = sortedProducts.findIndex((p: Product) => p.id === targetProductId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    await updateProductsOrder(draggedIndex, targetIndex);
    setDraggedProductId(null);
  };

  const updateProductsOrder = async (fromIndex: number, toIndex: number) => {
    const newOrder = [...sortedProducts];
    const [removed] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, removed);

    try {
      for (let i = 0; i < newOrder.length; i++) {
        await updateProductOrder({ id: newOrder[i].id, menu_order: i + 1 }).unwrap();
      }
    } catch (error) {
      console.error('Ошибка обновления порядка:', error);
      alert('Ошибка при изменении порядка товаров');
    }
  };

  const handleMoveUp = async (productId: number) => {
    const currentIndex = sortedProducts.findIndex((p: Product) => p.id === productId);
    if (currentIndex > 0) {
      await updateProductsOrder(currentIndex, currentIndex - 1);
    }
  };

  const handleMoveDown = async (productId: number) => {
    const currentIndex = sortedProducts.findIndex((p: Product) => p.id === productId);
    if (currentIndex < sortedProducts.length - 1) {
      await updateProductsOrder(currentIndex, currentIndex + 1);
    }
  };

  const handleConfirmStatusUpdate = (orderId: number, status: string) => {
    handleStatusUpdate(orderId, status);
    // Закрываем подтверждение после выполнения действия
    setExpandedConfirmation({
      orderId: null,
      action: null,
    });
  };

  const getPlaceholder = () => {
    switch (mainSection) {
      case 'orders': return 'Поиск заказа...';
      case 'products': return 'Поиск товара...';
      case 'customers': return 'Поиск клиента...';
      default: return 'Поиск...';
    }
  };

  const isLoading = ordersLoading || productsLoading || customersLoading || authLoading;

  // Check for authentication status
  if (!isAuthenticated && !authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl font-bold mb-4">
            Требуется авторизация
          </div>
          <div className="text-slate-600">
            Пожалуйста, <a href="/login" className="text-orange-600 hover:text-orange-700 underline">войдите в систему</a>
          </div>
        </div>
      </div>
    );
  }

  // Check for authentication errors
  const hasAuthError = ordersError || customersError;
  const isAuthErrorDetected = hasAuthError && 
    (isAuthenticationError(ordersError) || isAuthenticationError(customersError));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Authentication Error Banner */}
      {isAuthErrorDetected && (
        <div className="bg-red-50 border-2 border-red-200 mx-4 mt-4 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="text-red-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-bold text-red-800">Ошибка аутентификации</div>
              <div className="text-red-600 text-sm">
                Не удалось получить доступ к данным. Пожалуйста, проверьте авторизацию.
              </div>
            </div>
          </div>
        </div>
      )}

      <Header 
        showSettings={showSettings} setShowSettings={setShowSettings}
        showStats={showStats} setShowStats={setShowStats}
        userName={userName}
      />

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Main Sections Navigation */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-4">
          {MAIN_SECTIONS.map(section => (
            <button 
              key={section.id} 
              onClick={() => {
                setMainSection(section.id);
                setSearchQuery('');
                if (section.id === 'orders') {
                  setActiveTab('on-hold');
                }
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                mainSection === section.id 
                  ? `bg-linear-to-r ${section.color} text-white shadow-lg scale-105` 
                  : 'bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <section.icon /> {section.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <input 
          type="text" 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={getPlaceholder()}
          className="w-full p-4 rounded-xl border-2 border-slate-200 outline-none focus:border-orange-500 mb-6"
        />

        {/* Order Status Tabs - только для раздела заказов */}
        {mainSection === 'orders' && (
          <div className="flex gap-3 overflow-x-auto pb-4 mb-6">
            {ORDER_TABS.map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? `bg-linear-to-r ${tab.color} text-white shadow-lg scale-105` 
                    : 'bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <tab.icon /> {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <main className="mt-6 space-y-4">
          {isLoading ? (
            <p className="text-center py-10">Загрузка...</p>
          ) : (
            <>
              {mainSection === 'orders' && (
                <>
                  {orders.length === 0 ? (
                    <p className="text-center py-10 text-slate-500">Заказы не найдены</p>
                  ) : (
                    orders.map(order => (
                      <OrderCard 
                        key={order.id}
                        order={order}
                        activeTab={activeTab}
                        activeTabData={activeTabData}
                        isProcessing={processingIds.has(order.id)}
                        isRemoving={removingOrderIds.has(order.id)}
                        onStatusUpdate={(id, status) => handleConfirmStatusUpdate(id, status)}
                        onViewDetails={handleViewDetails}
                        onConfirmAction={handleConfirmAction}
                        showConfirmation={expandedConfirmation.orderId === order.id}
                        confirmationAction={expandedConfirmation.orderId === order.id ? expandedConfirmation.action || '' : ''}
                      />
                    ))
                  )}
                </>
              )}

              {mainSection === 'products' && (
                <>
                  {/* Кнопка добавления товара и фильтры */}
                  <div className="mb-6 space-y-4">
                    <button
                      onClick={() => setShowAddProductModal(true)}
                      className="w-full md:w-auto bg-linear-to-r from-orange-500 to-orange-600 text-white px-6 py-4 md:py-3 rounded-xl font-black flex items-center justify-center gap-2 hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg text-base md:text-sm"
                    >
                      <FaPlus /> Добавить товар
                    </button>

                    {/* Фильтр по категориям */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-2 px-2">
                      <button
                        onClick={() => setSelectedCategoryFilter(null)}
                        className={`px-4 py-2.5 md:py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap shrink-0 ${
                          !selectedCategoryFilter
                            ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                            : 'bg-white border-2 border-slate-200 text-slate-600 active:bg-slate-50'
                        }`}
                      >
                        Все товары
                      </button>
                      {categories?.map((cat: { id: number; name: string }) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategoryFilter(cat.id)}
                          className={`px-4 py-2.5 md:py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap shrink-0 ${
                            selectedCategoryFilter === cat.id
                              ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                              : 'bg-white border-2 border-slate-200 text-slate-600 active:bg-slate-50'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>

                    {/* Фильтр по статусу видимости */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-2 px-2">
                      <button
                        onClick={() => setSelectedStatusFilter('all')}
                        className={`px-4 py-2.5 md:py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap shrink-0 ${
                          selectedStatusFilter === 'all'
                            ? 'bg-linear-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                            : 'bg-white border-2 border-slate-200 text-slate-600 active:bg-slate-50'
                        }`}
                      >
                        Все статусы
                      </button>
                      <button
                        onClick={() => setSelectedStatusFilter('publish')}
                        className={`px-4 py-2.5 md:py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap shrink-0 ${
                          selectedStatusFilter === 'publish'
                            ? 'bg-linear-to-r from-green-500 to-green-600 text-white shadow-lg'
                            : 'bg-white border-2 border-slate-200 text-slate-600 active:bg-slate-50'
                        }`}
                      >
                        <FaEye className="inline mr-1" size={12} />
                        Видимые
                      </button>
                      <button
                        onClick={() => setSelectedStatusFilter('draft')}
                        className={`px-4 py-2.5 md:py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap shrink-0 ${
                          selectedStatusFilter === 'draft'
                            ? 'bg-linear-to-r from-red-500 to-red-600 text-white shadow-lg'
                            : 'bg-white border-2 border-slate-200 text-slate-600 active:bg-slate-50'
                        }`}
                      >
                        <FaEyeSlash className="inline mr-1" size={12} />
                        Скрытые
                      </button>
                    </div>
                  </div>

                  {sortedProducts.length === 0 ? (
                    <div className="text-center py-20">
                      <FaBox className="text-6xl text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 text-lg mb-2">
                        {selectedCategoryFilter 
                          ? 'Товары в этой категории не найдены' 
                          : selectedStatusFilter === 'draft' 
                            ? 'Скрытые товары не найдены'
                            : selectedStatusFilter === 'publish'
                              ? 'Видимые товары не найдены'
                              : 'Товары не найдены'
                        }
                      </p>
                      <p className="text-slate-400 text-sm">
                        {selectedStatusFilter === 'draft' 
                          ? 'Сначала скройте некоторые товары из витрины'
                          : selectedStatusFilter === 'publish'
                            ? 'Опубликуйте некоторые товары, чтобы они были видны'
                            : 'Начните с добавления первого товара'
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 md:space-y-4">
                      {sortedProducts.map((product: Product, index: number) => (
                        <div
                          key={product.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, product.id)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, product.id)}
                          className={`relative group ${
                            draggedProductId === product.id ? 'opacity-50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2 md:gap-3">
                            {/* Кнопки перемещения для мобильных */}
                            <div className="flex flex-col gap-2 md:hidden pt-1">
                              <button
                                onClick={() => handleMoveUp(product.id)}
                                disabled={index === 0}
                                className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed active:bg-slate-200 active:scale-95 transition-all shadow-sm"
                                title="Вверх"
                              >
                                <FaArrowUp size={16} />
                              </button>
                              <button
                                onClick={() => handleMoveDown(product.id)}
                                disabled={index === sortedProducts.length - 1}
                                className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed active:bg-slate-200 active:scale-95 transition-all shadow-sm"
                                title="Вниз"
                              >
                                <FaArrowDown size={16} />
                              </button>
                            </div>

                            {/* Иконка перетаскивания для десктопа */}
                            <div className="hidden md:flex shrink-0 w-10 h-10 items-center justify-center text-slate-400 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                              <FaGripVertical size={18} />
                            </div>

                            {/* Номер позиции */}
                            <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 rounded-xl font-black text-slate-700 text-sm md:text-base shadow-sm">
                              {index + 1}
                            </div>

                            {/* Карточка товара */}
                            <div className="flex-1 min-w-0">
                              <ProductCard 
                                product={product} 
                                onEdit={handleEditProduct}
                                isDragging={draggedProductId === product.id}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="text-xs md:text-sm text-slate-400 text-center mt-6 space-y-1">
                        <p className="hidden md:block">💡 Перетащите товары для изменения порядка отображения</p>
                        <p className="md:hidden">💡 Используйте кнопки ↑↓ для изменения порядка</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {mainSection === 'customers' && (
                <>
                  {customersError && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
                      <p className="text-red-600 font-bold">Ошибка загрузки клиентов:</p>
                      <p className="text-red-500 text-sm">{JSON.stringify(customersError, null, 2)}</p>
                    </div>
                  )}
                  
                  {/* Кнопки сортировки клиентов */}
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-sm font-bold text-slate-600">Сортировка:</span>
                    <button
                      onClick={() => setCustomerSortBy('orders')}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                        customerSortBy === 'orders'
                          ? 'bg-linear-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                          : 'bg-white border-2 border-slate-200 text-slate-600 active:bg-slate-50'
                      }`}
                    >
                      <FaShoppingCart className="inline mr-2" size={12} />
                      По заказам
                    </button>
                    <button
                      onClick={() => setCustomerSortBy('spent')}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                        customerSortBy === 'spent'
                          ? 'bg-linear-to-r from-green-500 to-green-600 text-white shadow-lg'
                          : 'bg-white border-2 border-slate-200 text-slate-600 active:bg-slate-50'
                      }`}
                    >
                      <FaDollarSign className="inline mr-2" size={12} />
                      По потраченному
                    </button>
                  </div>

                  {customersLoading ? (
                    <div className="text-center py-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                      <p className="text-slate-500">Загрузка клиентов...</p>
                    </div>
                  ) : filteredCustomers.length === 0 ? (
                    <p className="text-center py-10 text-slate-500">Клиенты не найдены</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredCustomers.map((customer: Customer) => (
                        <CustomerCard key={customer.id} customer={customer} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </main>
      </div>

      {/* Модальное окно деталей заказа */}
      <OrderDetailsModal
        isOpen={orderDetailsModal.isOpen}
        order={orderDetailsModal.order}
        onClose={() => setOrderDetailsModal({ isOpen: false, order: null })}
      />

      {/* Модальное окно добавления товара */}
      <AddProductModal
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
      />

      {/* Модальное окно редактирования товара */}
      <EditProductModal
        isOpen={showEditProductModal}
        product={selectedProduct}
        onClose={() => {
          setShowEditProductModal(false);
          setSelectedProduct(null);
        }}
      />

      {/* Модальное окно статистики */}
      <StatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
      />
    </div>
  );
};

export default Dashboard;
