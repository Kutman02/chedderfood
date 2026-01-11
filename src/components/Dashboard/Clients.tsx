import { useMemo, useState } from 'react';
import { FaShoppingCart, FaDollarSign, FaUsers } from 'react-icons/fa';
import { useGetAllWooCustomersQuery } from '../../app/services/wooCommerceApi';
import type { Customer } from '../../types/types';
import { CustomerCard } from './CustomerCard';
import { CustomerSkeleton } from '../Skeleton';

interface ClientsProps {
  searchQuery: string;
}

export const Clients = ({ searchQuery }: ClientsProps) => {
  const [customerSortBy, setCustomerSortBy] = useState<'orders' | 'spent'>('orders');

  const {
    data: customersData,
    isLoading: customersLoading,
    error: customersError,
  } = useGetAllWooCustomersQuery({ per_page: 100 });

  // Фильтрация по поиску
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

      return (
        fullName.includes(query) ||
        phone.includes(query) ||
        address.includes(query) ||
        city.includes(query) ||
        username.includes(query)
      );
    });
  }, [customersData, searchQuery]);

  // Сортировка
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

  // Loading
  if (customersLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomerSkeleton count={6} />
      </div>
    );
  }

  // Error
  if (customersError) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
        <FaUsers className="text-4xl text-red-400 mx-auto mb-4" />
        <p className="text-red-600 font-bold mb-2">Ошибка загрузки клиентов</p>
        <p className="text-red-500 text-sm">
          Не удалось получить список клиентов. Проверьте подключение к API.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Панель сортировки */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm font-bold text-slate-600">Сортировка:</span>

        <button
          onClick={() => setCustomerSortBy('orders')}
          className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
            customerSortBy === 'orders'
              ? 'bg-linear-to-r from-purple-500 to-purple-600 text-white shadow-lg'
              : 'bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50'
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
              : 'bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FaDollarSign className="inline mr-2" size={12} />
          По потраченному
        </button>
      </div>

      {/* Список клиентов */}
      {filteredCustomers.length === 0 ? (
        <div className="text-center py-20">
          <FaUsers className="text-6xl text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">Клиенты не найдены</p>
          <p className="text-slate-400 text-sm">
            Попробуйте изменить запрос поиска
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCustomers.map((customer: Customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      )}
    </>
  );
};
