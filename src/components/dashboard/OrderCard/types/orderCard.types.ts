import type { Order, Product } from "@/types"

/* =========================
   TAB CONFIG (локально или вынеси)
========================= */

export type TabConfig = {
  label: string
  color: string
  borderColor: string
  bgColor?: string
  icon?: unknown
  textColor?: string
}


/* =========================
   ORDER CARD PROPS
========================= */

export interface OrderCardProps {
  order: Order
  products: Product[]
  activeTab: string
  activeTabData?: TabConfig

  isProcessing: boolean
  isRemoving: boolean

  onStatusUpdate: (id: number, status: string) => void

  isDetailsOpen: boolean
  onToggleDetails: (orderId: number) => void

  // 🔥 ЧИСТЫЙ API
  onConfirmAction: (orderId: number, action: string) => void

  showConfirmation?: boolean
  confirmationAction?: string
}


/* =========================
   ORDER HEADER PROPS
========================= */

export interface OrderCardHeaderProps {
  order: Order
  activeTabData?: TabConfig
}


/* =========================
   ORDER TYPE BADGE
========================= */

export interface OrderTypeBadgeProps {
  order: Order
}


/* =========================
   ORDER ADDRESS
========================= */

export interface OrderAddressProps {
  order: Order
  activeTabData?: TabConfig
}


/* =========================
   ORDER ACTIONS
========================= */

export interface OrderActionsProps {
  order: Order
  activeTab: string

  onConfirmAction: (orderId: number, action: string) => void
}


/* =========================
   ORDER CONFIRMATION
========================= */

export interface OrderConfirmationProps {
  action: string
  orderNumber: string | number
  isProcessing?: boolean
  onConfirm: () => void
  onCancel: () => void
}
