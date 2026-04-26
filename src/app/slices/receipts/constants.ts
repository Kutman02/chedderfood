import { STORAGE_KEYS } from "@/shared/constants/storage"

export const RECEIPTS_KEY = STORAGE_KEYS.RECEIPTS
export const RECEIPTS_DELETED_IDS_KEY = STORAGE_KEYS.RECEIPTS_DELETED_IDS
export const ACTIVE_RECEIPT_ID_KEY = STORAGE_KEYS.ACTIVE_RECEIPT_ID
export const CUSTOMER_DATA_KEY = STORAGE_KEYS.CUSTOMER_DATA
export const CHECKOUT_FORM_KEY = STORAGE_KEYS.CHECKOUT_FORM

export const LEGACY_RECEIPTS_KEYS = ["receipts", "orders_receipts"]
export const LEGACY_CUSTOMER_DATA_KEYS = ["customer_data", "customerData"]

export const DELETABLE_RECEIPT_STATUSES = new Set(["completed", "cancelled"])
