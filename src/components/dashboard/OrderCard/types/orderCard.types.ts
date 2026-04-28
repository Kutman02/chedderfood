import type { Order } from "@/types"

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
  activeTabData?: TabConfig

  isProcessing: boolean
  isRemoving: boolean

  onViewDetails: (orderId: number) => void
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
  compact?: boolean
}
