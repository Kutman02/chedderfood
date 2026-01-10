import type { Order } from '../types/types';

export const filterOrders = (orders: Order[] | undefined, query: string): Order[] => {
  if (!orders) return [];
  if (!query.trim()) return orders;

  const searchTerm = query.toLowerCase().trim();
  const searchTermClean = searchTerm.replace(/[\s\-()]/g, '');

  return orders.filter((order) => {
    const orderNumber = (order.number || order.id.toString()).toLowerCase();
    const firstName = (order.billing.first_name || '').toLowerCase();
    const lastName = (order.billing.last_name || '').toLowerCase();
    const fullName = `${firstName} ${lastName}`.trim();
    const phone = (order.billing.phone || '').toLowerCase().replace(/[\s\-()]/g, '');
    const email = (order.billing.email || '').toLowerCase();

    return (
      orderNumber.includes(searchTerm) ||
      fullName.includes(searchTerm) ||
      phone.includes(searchTermClean) ||
      email.includes(searchTerm)
    );
  });
};

export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Только что';
  if (diffMins < 60) return `${diffMins} мин назад`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} ч назад`;
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
};