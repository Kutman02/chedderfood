import type {
  Customer,
  CustomersResponse,
} from "@/types"

export const normalizeCustomersResponse = (
  response: CustomersResponse
): Customer[] => response.data ?? []
