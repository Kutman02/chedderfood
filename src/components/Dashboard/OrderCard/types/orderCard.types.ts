import type { Order, TabConfig } from "../../../../types"

/* =========================
   ORDER CARD PROPS
========================= */

export interface OrderCardProps {
  order: Order
  activeTab: string
  activeTabData?: TabConfig

  isProcessing: boolean
  isRemoving: boolean

  onStatusUpdate: (id: number, status: string) => void
  onViewDetails: (order: Order) => void
  onConfirmAction: (orderId: number, status: string, action: string) => void

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
  onConfirmAction: (id: number, status: string, action: string) => void
}


/* =========================
   ORDER CONFIRMATION
========================= */

export interface OrderConfirmationProps {
  action: string
  onConfirm: () => void
  onCancel: () => void
}