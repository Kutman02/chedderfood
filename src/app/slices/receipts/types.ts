import type { CustomerData, ReceiptData } from "@/types"

export type ReceiptsState = {
  receipts: ReceiptData[]
  deletedReceiptIds: number[]
  activeReceiptId: number | null
  customerData: CustomerData | null
}

export type ReceiptServerSyncPayload = {
  id: number
  status?: string
  reason?: string | null
  changed_at?: string | null
  date_created_human?: string
  date_created_unix?: number
  date_created?: string
}

export type LegacyCustomerData = Partial<CustomerData> & {
  apartment?: string
}
