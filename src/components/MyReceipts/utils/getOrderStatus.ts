export const getOrderStatus = (status: string) => {
  switch (status) {
    case "on-hold":
      return { label: "Ожидает подтверждения ресторана", color: "text-yellow-600" }

    case "processing":
      return { label: "Готовится", color: "text-blue-600" }

    case "ready":
      return { label: "Готов", color: "text-green-600" }
    case "completed":
      return { label: "Завершён", color: "text-yellow-900" }

    case "cancelled":
      return { label: "Отменён", color: "text-red-600" }

    default:
      return { label: status, color: "text-slate-600" }
  }
}