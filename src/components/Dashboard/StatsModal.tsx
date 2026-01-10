import { useState, useMemo } from 'react';
import { FaTimes, FaCalendarAlt, FaChartLine, FaBox, FaTag, FaDollarSign, FaShoppingCart, FaClock } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, subDays } from 'date-fns';
import { useGetAnalyticsOrdersQuery, useGetAnalyticsProductsQuery } from '../../app/services/api';
import type { OrderItem } from '../../types/types';

interface AnalyticsData {
  revenue: number;
  orders: number;
  items_sold: number;
  average_order_value: number;
  cancelled_orders: number;
  pending_orders: number;
  processing_orders: number;
  completed_orders: number;
  categories: Array<{
    name: string;
    items_sold: number;
    revenue: number;
    orders: number;
  }>;
  products: Array<{
    name: string;
    items_sold: number;
    revenue: number;
    avg_price: number;
  }>;
  daily_stats: Array<{
    date: string;
    revenue: number;
    orders: number;
    items_sold: number;
  }>;
  deleted_products?: Array<{
    name: string;
    total_sales: number;
    price: string;
    last_modified: string;
  }>;
}

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const StatsModal = ({ isOpen, onClose }: StatsModalProps) => {
  const [startDate, setStartDate] = useState<string>(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  
  // Получаем реальные данные из WooCommerce Analytics
  const { data: ordersData, isLoading: ordersLoading } = useGetAnalyticsOrdersQuery({
    after: startDate,
    before: endDate,
    per_page: 100
  });
  
  const { data: productsData, isLoading: productsLoading } = useGetAnalyticsProductsQuery({
    per_page: 100
  });

  // Обрабатываем данные для статистики
  const analyticsData: AnalyticsData | null = useMemo(() => {
    console.log('StatsModal Debug:', {
      ordersData,
      productsData,
      ordersLoading,
      productsLoading,
      startDate,
      endDate
    });

    if (!ordersData || ordersData.length === 0) {
      console.log('No orders data available');
      return null;
    }

    if (!productsData || productsData.length === 0) {
      console.log('No products data available');
      return null;
    }

    console.log('Processing fast food analytics data...');

    // Фильтруем заказы по статусам
    const validOrders = ordersData.filter(order => order.status !== 'cancelled' && order.status !== 'refunded');
    const cancelledOrders = ordersData.filter(order => order.status === 'cancelled' || order.status === 'refunded');
    const pendingOrders = ordersData.filter(order => order.status === 'on-hold' || order.status === 'pending');
    const processingOrders = ordersData.filter(order => order.status === 'processing');
    const completedOrders = ordersData.filter(order => order.status === 'completed');

    // Считаем общую выручку, заказы и товары (только из валидных заказов)
    const totalRevenue = validOrders.reduce((sum, order) => sum + parseFloat(order.total || '0'), 0);
    const totalOrders = validOrders.length;
    const totalItemsSold = validOrders.reduce((sum, order) => 
      sum + order.line_items.reduce((itemSum: number, item: OrderItem) => itemSum + item.quantity, 0), 0);

    // Считаем средний чек
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Группируем товары по продажам (только валидные заказы)
    const productSalesMap = new Map();
    validOrders.forEach(order => {
      order.line_items.forEach((item: OrderItem) => {
        const existing = productSalesMap.get(item.name) || { 
          name: item.name, 
          quantity: 0, 
          revenue: 0,
          price: parseFloat(item.total || '0') / item.quantity
        };
        existing.quantity += item.quantity;
        existing.revenue += parseFloat(item.total || '0');
        productSalesMap.set(item.name, existing);
      });
    });

    const topProducts = Array.from(productSalesMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
      .map(product => ({
        name: product.name,
        items_sold: product.quantity,
        revenue: product.revenue,
        avg_price: product.price
      }));

    // Группируем по категориям (только валидные заказы)
    const categoryMap = new Map();
    
    // Создаем карту товаров с категориями
    const productCategoryMap = new Map();
    productsData.forEach(product => {
      productCategoryMap.set(product.name, {
        categories: product.categories || [],
        id: product.id
      });
    });
    
    console.log('Product category map sample:', Array.from(productCategoryMap.entries()).slice(0, 3));
    
    validOrders.forEach(order => {
      order.line_items.forEach((item: OrderItem) => {
        // Получаем категории товара из данных о товарах
        let productInfo = productCategoryMap.get(item.name);
        
        // Если точное совпадение не найдено, пытаем найти по частичному совпадению
        if (!productInfo) {
          const productName = item.name.toLowerCase();
          for (const [key, value] of productCategoryMap.entries()) {
            if (key.toLowerCase().includes(productName) || productName.includes(key.toLowerCase())) {
              productInfo = value;
              break;
            }
          }
        }
        
        const categories = productInfo ? productInfo.categories : [];
        
        if (categories.length === 0) {
          // Если нет категорий, группируем как "Без категории"
          const categoryName = "Без категории";
          if (!categoryMap.has(categoryName)) {
            categoryMap.set(categoryName, {
              name: categoryName,
              items_sold: 0,
              revenue: 0,
              orders: 0
            });
          }
          const cat = categoryMap.get(categoryName);
          cat.items_sold += item.quantity;
          cat.revenue += parseFloat(item.total || '0');
          cat.orders += 1;
        } else {
          categories.forEach((category: { id: number; name: string; slug: string }) => {
            if (!categoryMap.has(category.name)) {
              categoryMap.set(category.name, {
                name: category.name,
                items_sold: 0,
                revenue: 0,
                orders: 0
              });
            }
            const cat = categoryMap.get(category.name);
            cat.items_sold += item.quantity;
            cat.revenue += parseFloat(item.total || '0');
            cat.orders += 1;
          });
        }
      });
    });

    const topCategories = Array.from(categoryMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);

    // Создаем данные для графика по дням (только валидные заказы)
    interface DailyStat {
      date: string;
      revenue: number;
      orders: number;
      items_sold: number;
    }

    const dailyStats = validOrders.reduce((acc: DailyStat[], order) => {
      const date = format(new Date(order.date_created), 'dd.MM');
      const existing = acc.find(item => item.date === date);
      
      if (existing) {
        existing.revenue += parseFloat(order.total || '0');
        existing.orders += 1;
        existing.items_sold += order.line_items.reduce((sum: number, item: OrderItem) => sum + item.quantity, 0);
      } else {
        acc.push({
          date,
          revenue: parseFloat(order.total || '0'),
          orders: 1,
          items_sold: order.line_items.reduce((sum: number, item: OrderItem) => sum + item.quantity, 0)
        });
      }
      
      return acc;
    }, [] as DailyStat[]).sort((a, b) => a.date.localeCompare(b.date));

    // Данные для удаленных товаров
    const deletedProductsData = productsData
      .filter(p => p.status === 'draft' || !p.catalog_visibility || p.catalog_visibility === 'hidden')
      .map(product => ({
        name: product.name,
        total_sales: product.total_sales || 0,
        price: product.price || '0',
        last_modified: product.date_modified
      }))
      .sort((a, b) => new Date(b.last_modified).getTime() - new Date(a.last_modified).getTime())
      .slice(0, 20);

    return {
      revenue: totalRevenue,
      orders: totalOrders,
      items_sold: totalItemsSold,
      average_order_value: averageOrderValue,
      cancelled_orders: cancelledOrders.length,
      pending_orders: pendingOrders.length,
      processing_orders: processingOrders.length,
      completed_orders: completedOrders.length,
      categories: topCategories,
      products: topProducts,
      daily_stats: dailyStats,
      deleted_products: deletedProductsData
    };
  }, [ordersData, productsData, startDate, endDate, ordersLoading, productsLoading]);

  const loading = ordersLoading || productsLoading;

  const getDateRangeText = () => {
    const start = format(new Date(startDate), 'dd.MM.yyyy');
    const end = format(new Date(endDate), 'dd.MM.yyyy');
    return `${start} - ${end}`;
  };

  const handleQuickRange = (days: number) => {
    setEndDate(format(new Date(), 'yyyy-MM-dd'));
    setStartDate(format(subDays(new Date(), days), 'yyyy-MM-dd'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-hidden">
      {/* Хедер */}
      <div className="bg-white border-b border-slate-200 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl font-black text-slate-800">Статистика</h1>
          
          {/* Выбор дат - мобильная адаптация */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1 w-full sm:w-auto">
              <button
                onClick={() => handleQuickRange(7)}
                className="flex-1 sm:flex-initial px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-white transition-all"
              >
                7 дней
              </button>
              <button
                onClick={() => handleQuickRange(30)}
                className="flex-1 sm:flex-initial px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-white transition-all"
              >
                30 дней
              </button>
              <button
                onClick={() => handleQuickRange(90)}
                className="flex-1 sm:flex-initial px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-white transition-all"
              >
                90 дней
              </button>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate}
                className="flex-1 sm:flex-initial px-2 py-1.5 sm:px-3 sm:py-2 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-slate-500 hidden sm:inline">—</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                max={format(new Date(), 'yyyy-MM-dd')}
                className="flex-1 sm:flex-initial px-2 py-1.5 sm:px-3 sm:py-2 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
            <FaCalendarAlt size={10} className="sm:size-12 lg:size-14" />
            <span>{getDateRangeText()}</span>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <FaTimes size={20} />
        </button>
      </div>

      {/* Контент с прокруткой */}
      <div className="flex-1 overflow-y-auto" style={{ height: 'calc(100vh - 120px)' }}>
        <div className="p-3 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : analyticsData ? (
            <div className="space-y-6">
              {/* Основные метрики */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
                <div className="bg-linear-to-r from-green-500 to-green-600 rounded-xl p-3 sm:p-4 text-white">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <FaDollarSign size={14} className="sm:size-16 lg:size-18" />
                    <span className="text-xs sm:text-sm font-medium opacity-90">Чистая выручка</span>
                  </div>
                  <p className="text-lg sm:text-2xl font-bold">{analyticsData.revenue.toLocaleString()} сом</p>
                </div>
                
                <div className="bg-linear-to-r from-blue-500 to-blue-600 rounded-xl p-3 sm:p-4 text-white">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <FaShoppingCart size={14} className="sm:size-16 lg:size-18" />
                    <span className="text-xs sm:text-sm font-medium opacity-90">Выполнено</span>
                  </div>
                  <p className="text-lg sm:text-2xl font-bold">{analyticsData.orders.toLocaleString()}</p>
                </div>
                
                <div className="bg-linear-to-r from-orange-500 to-orange-600 rounded-xl p-3 sm:p-4 text-white">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <FaChartLine size={14} className="sm:size-16 lg:size-18" />
                    <span className="text-xs sm:text-sm font-medium opacity-90">Средний чек</span>
                  </div>
                  <p className="text-lg sm:text-2xl font-bold">
                    {Math.round(analyticsData.average_order_value).toLocaleString()} сом
                  </p>
                </div>

                <div className="bg-linear-to-r from-yellow-500 to-yellow-600 rounded-xl p-3 sm:p-4 text-white">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <FaClock size={14} className="sm:size-16 lg:size-18" />
                    <span className="text-xs sm:text-sm font-medium opacity-90">Ожидают</span>
                  </div>
                  <p className="text-lg sm:text-2xl font-bold">{analyticsData.pending_orders.toLocaleString()}</p>
                </div>

                <div className="bg-linear-to-r from-purple-500 to-purple-600 rounded-xl p-3 sm:p-4 text-white">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <FaBox size={14} className="sm:size-16 lg:size-18" />
                    <span className="text-xs sm:text-sm font-medium opacity-90">Готовятся</span>
                  </div>
                  <p className="text-lg sm:text-2xl font-bold">{analyticsData.processing_orders.toLocaleString()}</p>
                </div>

                <div className="bg-linear-to-r from-red-500 to-red-600 rounded-xl p-3 sm:p-4 text-white">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <FaTimes size={14} className="sm:size-16 lg:size-18" />
                    <span className="text-xs sm:text-sm font-medium opacity-90">Отменено</span>
                  </div>
                  <p className="text-lg sm:text-2xl font-bold">{analyticsData.cancelled_orders.toLocaleString()}</p>
                </div>
              </div>

              {/* График продаж */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4">График продаж</h2>
                <div className="h-48 sm:h-64 lg:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData.daily_stats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Выручка (сом)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="orders" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        name="Заказы"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Лучшие категории */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
                  <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FaTag size={12} className="sm:size-14 lg:size-16" />
                    Лучшие категории фастфуда – по выручке
                  </h2>
                  <div className="space-y-2 sm:space-y-3">
                    {analyticsData.categories.map((category, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 bg-slate-50 rounded-lg gap-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-xs sm:text-sm font-medium text-slate-700">{category.name}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 sm:gap-4 text-xs sm:text-sm">
                          <span className="text-slate-600">{category.items_sold} шт.</span>
                          <span className="font-bold text-green-600">{category.revenue.toLocaleString()} сом</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Лучшие товары */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
                  <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FaBox size={12} className="sm:size-14 lg:size-16" />
                    Топ-10 блюд – по продажам
                  </h2>
                  <div className="space-y-2 sm:space-y-3">
                    {analyticsData.products.map((product, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 bg-slate-50 rounded-lg gap-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <div>
                            <span className="text-xs sm:text-sm font-medium text-slate-700">{product.name}</span>
                            <span className="text-xs text-slate-500 ml-1 sm:ml-2">
                              ({product.avg_price.toFixed(0)} сом/шт)
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-2 sm:gap-4 text-xs sm:text-sm">
                          <span className="text-slate-600">{product.items_sold} шт.</span>
                          <span className="font-bold text-green-600">{product.revenue.toLocaleString()} сом</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Удаленные/скрытые товары */}
              {analyticsData.deleted_products && analyticsData.deleted_products.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
                  <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FaBox size={12} className="sm:size-14 lg:size-16" />
                    Удаленные и скрытые товары
                  </h2>
                  <div className="space-y-2 sm:space-y-3">
                    {analyticsData.deleted_products.map((product, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 bg-red-50 rounded-lg gap-2">
                        <div>
                          <span className="text-xs sm:text-sm font-medium text-slate-700">{product.name}</span>
                          <div className="text-xs text-slate-500">
                            Последнее изменение: {format(new Date(product.last_modified), 'dd.MM.yyyy')}
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-2 sm:gap-4 text-xs sm:text-sm">
                          <span className="text-slate-600">{product.total_sales} продано</span>
                          <span className="font-bold text-red-600">{product.price} сом</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* График категорий */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4">Распределение по категориям</h2>
                <div className="h-48 sm:h-64 lg:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.categories}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="revenue"
                      >
                        {analyticsData.categories.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-500">Нет данных для отображения</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
