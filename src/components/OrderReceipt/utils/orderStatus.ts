export const getStatusColor = (status: string): string => {
  switch (status) {
    case "on-hold":
      return "bg-yellow-100 text-yellow-800"

    case "processing":
      return "bg-blue-100 text-blue-800"

    case "completed":
      return "bg-green-100 text-green-800"

    case "cancelled":
      return "bg-red-100 text-red-800"

    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getStatusText = (status: string): string => {
  switch (status) {
    case "on-hold":
      return "Ожидаем подтверждение от ресторана"

    case "processing":
      return "Ваш заказ готовится"

    case "completed":
      return "Завершен"

    case "cancelled":
      return "Ресторан не подтвердил заказ"

    default:
      return status
  }
}