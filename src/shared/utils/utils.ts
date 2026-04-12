import type { Order } from "@/types";

export const filterOrders = (
  orders: Order[] | undefined,
  query?: string
): Order[] => {

  if (!orders) return [];

  const search = (query ?? "").trim().toLowerCase();

  if (!search) return orders;

  const searchClean = search.replace(/[\s\-()]/g, "");

  return orders.filter((order) => {

    const orderNumber = String(order.number ?? order.id ?? "")
      .toLowerCase();

    const fullName = (order.customer_name ?? "").toLowerCase();

    const phone = (order.phone ?? "")
      .toLowerCase()
      .replace(/[\s\-()]/g, "");

    return (
      orderNumber.includes(search) ||
      fullName.includes(search) ||
      phone.includes(searchClean)
    );

  });

};

export const formatTime = (dateString: string) => {

  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Только что";

  if (diffMins < 60) return `${diffMins} мин назад`;

  const diffHours = Math.floor(diffMins / 60);

  if (diffHours < 24) return `${diffHours} ч назад`;

  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit"
  });

};
