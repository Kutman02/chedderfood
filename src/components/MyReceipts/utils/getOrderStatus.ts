export const getOrderStatus = (status: string) => {
  switch (status) {
    case "pending":
      return { label: "Ожидает оплаты", color: "text-yellow-600" }

    case "on-hold":
      return { label: "Ожидает подтверждения", color: "text-orange-600" }

    case "processing":
      return { label: "Готовится", color: "text-blue-600" }

    case "completed":
      return { label: "Готов", color: "text-green-600" }

    case "cancelled":
      return { label: "Отменён", color: "text-red-600" }

    case "refunded":
      return { label: "Возврат", color: "text-red-500" }

    case "failed":
      return { label: "Ошибка оплаты", color: "text-red-600" }

    default:
      return { label: status, color: "text-slate-600" }
  }
}