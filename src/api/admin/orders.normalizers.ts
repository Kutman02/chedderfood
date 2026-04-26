import type {
  Order,
  OrdersResponse,
  OrderStatus,
  ShippingRate,
} from "@/types"

type RawOrderMeta = {
  key?: string
  value?: unknown
}

type RawOrder = Order & {
  billing?: {
    first_name?: string
    last_name?: string
    phone?: string
    email?: string
    address_1?: string
    address_2?: string
    apartment_office?: string
    city?: string
    postcode?: string
  }
  meta_data?: RawOrderMeta[]
  line_items?: Order["line_items"]
  date_created_gmt?: string
  created_at?: string
  changed_at?: string | null
  date_created_unix?: number | string
  date_created_human?: string
}

const parseDateTimestamp = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value > 1e12 ? value : value * 1000
  }

  if (typeof value !== "string") {
    return null
  }

  const raw = value.trim()
  if (!raw) return null

  if (/^\d+$/.test(raw)) {
    const numeric = Number(raw)
    if (Number.isFinite(numeric)) {
      return numeric > 1e12 ? numeric : numeric * 1000
    }
  }

  const directParsed = Date.parse(raw)
  if (!Number.isNaN(directParsed)) {
    return directParsed
  }

  const normalized = raw.replace(" ", "T").replace(/([+-]\d{2})(\d{2})$/, "$1:$2")

  const normalizedParsed = Date.parse(normalized)
  if (!Number.isNaN(normalizedParsed)) {
    return normalizedParsed
  }

  return null
}

const resolveOrderDateCreated = (order: RawOrder): string => {
  const firstHistoryDate = Array.isArray(order.status_history)
    ? order.status_history
        .map((entry) => entry?.changed_at)
        .find((value): value is string => typeof value === "string" && value.trim().length > 0)
    : undefined

  const candidates: unknown[] = [
    order.date_created_unix,
    order.date_created,
    order.date_created_gmt,
    order.created_at,
    order.changed_at,
    firstHistoryDate,
  ]

  for (const candidate of candidates) {
    const timestamp = parseDateTimestamp(candidate)
    if (timestamp !== null) {
      return new Date(timestamp).toISOString()
    }
  }

  return typeof order.date_created === "string" ? order.date_created : ""
}

const readMetaString = (
  metaData: RawOrderMeta[] | undefined,
  key: string
): string | undefined => {
  const found = metaData?.find((item) => item?.key === key)
  if (!found?.value) return undefined

  const value = String(found.value).trim()
  return value || undefined
}

const readFirstMetaString = (
  metaData: RawOrderMeta[] | undefined,
  keys: string[]
): string | undefined => {
  for (const key of keys) {
    const value = readMetaString(metaData, key)
    if (value) return value
  }
  return undefined
}

const readMetaBoolean = (
  metaData: RawOrderMeta[] | undefined,
  key: string
): boolean | undefined => {
  const found = metaData?.find((item) => item?.key === key)
  if (typeof found?.value === "boolean") return found.value
  if (typeof found?.value === "number") return found.value === 1
  if (typeof found?.value === "string") {
    const normalized = found.value.trim().toLowerCase()
    if (["1", "true", "yes"].includes(normalized)) return true
    if (["0", "false", "no"].includes(normalized)) return false
  }
  return undefined
}

const normalizeOrderTypeValue = (
  value: string | undefined
): "pickup" | "delivery" | undefined => {
  if (!value) return undefined

  const normalized = value.trim().toLowerCase()

  if (!normalized) return undefined

  if (
    normalized === "pickup" ||
    normalized === "local_pickup" ||
    normalized.includes("самовывоз")
  ) {
    return "pickup"
  }

  if (
    normalized === "delivery" ||
    normalized.includes("доставка")
  ) {
    return "delivery"
  }

  return undefined
}

const normalizeAddressValue = (
  value: string | undefined
): string | undefined => {
  if (!value) return undefined

  const normalized = value.trim()
  if (!normalized) return undefined

  const lowered = normalized.toLowerCase()

  if (
    lowered === "pickup" ||
    lowered === "local_pickup" ||
    lowered === "самовывоз"
  ) {
    return undefined
  }

  return normalized
}

const normalizeStatus = (status: string): OrderStatus => {
  if (status === "pending") return "on-hold"
  if (
    status === "on-hold" ||
    status === "processing" ||
    status === "ready" ||
    status === "completed" ||
    status === "cancelled"
  ) {
    return status
  }
  return "on-hold"
}

const toShippingNumber = (value: unknown): number | null => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

const normalizeShippingRate = (value: unknown): ShippingRate | null => {
  if (!value || typeof value !== "object") return null

  const source = value as Record<string, unknown>
  const rateId = String(source.rate_id || "").trim()

  if (!rateId) return null

  const methodIdRaw = String(source.method_id || "").trim()
  const parsedMethodId = rateId.split(":")[0] || ""
  const methodId = methodIdRaw || parsedMethodId

  const instanceIdRaw = toShippingNumber(source.instance_id)
  const parsedInstanceId = Number(rateId.split(":")[1])
  const instanceId = Number.isFinite(instanceIdRaw)
    ? Number(instanceIdRaw)
    : Number.isFinite(parsedInstanceId)
      ? parsedInstanceId
      : 0

  const cost = toShippingNumber(source.cost) ?? 0
  const total = toShippingNumber(source.total) ?? cost
  const taxTotal = toShippingNumber(source.tax_total)
  const label = String(source.label || "").trim() || methodId || "Доставка"
  const currency = String(source.currency || "KGS").trim() || "KGS"
  const isFreeRaw = source.is_free
  const isFree =
    typeof isFreeRaw === "boolean"
      ? isFreeRaw
      : String(isFreeRaw || "").trim() === "1" || total <= 0

  return {
    rate_id: rateId,
    method_id: methodId,
    instance_id: instanceId,
    label,
    cost,
    tax_total: taxTotal ?? undefined,
    total,
    currency,
    is_free: isFree,
  }
}

const normalizeShippingLines = (value: unknown): ShippingRate[] => {
  if (!Array.isArray(value)) return []

  return value
    .map(normalizeShippingRate)
    .filter((line): line is ShippingRate => line !== null)
}

const normalizeShippingTotal = (
  rawShippingTotal: unknown,
  shippingLines: ShippingRate[]
): string | undefined => {
  const shippingFromTotal = toShippingNumber(rawShippingTotal)

  if (shippingFromTotal !== null) {
    return Math.max(shippingFromTotal, 0).toFixed(2)
  }

  const shippingFromLine = toShippingNumber(
    shippingLines[0]?.total ?? shippingLines[0]?.cost
  )

  if (shippingFromLine !== null) {
    return Math.max(shippingFromLine, 0).toFixed(2)
  }

  return undefined
}

const normalizeOrder = (order: RawOrder): Order => {
  const metaData = Array.isArray(order.meta_data) ? order.meta_data : undefined
  const billing = order.billing
  const shippingLines = normalizeShippingLines(order.shipping_lines)
  const shippingTotal = normalizeShippingTotal(order.shipping_total, shippingLines)

  const orderTypeMeta =
    readMetaString(metaData, "order_type") ||
    readMetaString(metaData, "shipping_method") ||
    readMetaString(metaData, "order_delivery_type")

  const rawOrderAddress = normalizeAddressValue(order.address)

  const addressFromBilling = billing?.address_1?.trim() || undefined
  const pickupAddress =
    normalizeAddressValue(order.pickup_address) ||
    readFirstMetaString(metaData, [
      "pickup_address",
      "restaurant_pickup_address",
      "restaurant_address",
    ])

  const detectedOrderType =
    normalizeOrderTypeValue(order.order_type) ||
    normalizeOrderTypeValue(orderTypeMeta) ||
    (pickupAddress ? "pickup" : undefined) ||
    (rawOrderAddress ? undefined : normalizeOrderTypeValue(order.address))

  const normalizedOrderType = detectedOrderType || "delivery"

  const pickupMapUrl =
    order.pickup_map_url?.trim() ||
    order.pickup_2gis_url?.trim() ||
    readFirstMetaString(metaData, [
      "pickup_map_url",
      "pickup_2gis_url",
      "pickup_2gis_link",
      "map_2gis",
      "map2gis",
      "restaurant_2gis_url",
      "restaurant_pickup_map_url",
      "restaurant_map_url",
      "map2gis_url",
    ])

  return {
    ...order,
    status: normalizeStatus(order.status),
    date_created: resolveOrderDateCreated(order),

    customer_name:
      order.customer_name?.trim() ||
      [billing?.first_name, billing?.last_name].filter(Boolean).join(" ").trim() ||
      "Без имени",

    phone: order.phone?.trim() || billing?.phone?.trim() || "",
    email: order.email || billing?.email,
    first_name: order.first_name || billing?.first_name,
    last_name: order.last_name || billing?.last_name,

    address:
      rawOrderAddress ||
      (normalizedOrderType === "pickup" ? pickupAddress : undefined) ||
      addressFromBilling,
    address_2: order.address_2 || billing?.address_2,
    city: order.city || billing?.city,
    postcode: order.postcode || billing?.postcode,
    apartment_office:
      order.apartment_office ||
      billing?.apartment_office ||
      readFirstMetaString(metaData, ["apartment_office", "apartment"]),
    apartment: order.apartment || readMetaString(metaData, "apartment"),
    floor: order.floor || readMetaString(metaData, "floor"),

    order_type: normalizedOrderType,
    shipping_total: shippingTotal,
    shipping_lines: shippingLines,
    pickup_address: pickupAddress,
    pickup_map_url: pickupMapUrl,
    needs_cutlery_and_napkins:
      order.needs_cutlery_and_napkins ??
      readMetaBoolean(metaData, "needs_cutlery_and_napkins") ??
      ((order.needs_cutlery ?? readMetaBoolean(metaData, "needs_cutlery") ?? false) ||
        (order.needs_napkins ?? readMetaBoolean(metaData, "needs_napkins") ?? false)),
    needs_cutlery:
      order.needs_cutlery ?? readMetaBoolean(metaData, "needs_cutlery"),
    needs_napkins:
      order.needs_napkins ?? readMetaBoolean(metaData, "needs_napkins"),

    items: Array.isArray(order.items)
      ? order.items
      : Array.isArray(order.line_items)
        ? order.line_items
        : [],
  }
}

const emptyStatusCounts = () => ({
  "on-hold": 0,
  processing: 0,
  ready: 0,
  completed: 0,
  cancelled: 0,
})

export const normalizeOrdersResponse = (response: OrdersResponse): OrdersResponse => {
  const data = Array.isArray(response.data)
    ? response.data.map(normalizeOrder)
    : []

  const statusCountsFallback = data.reduce((acc, order) => {
    acc[order.status] += 1
    return acc
  }, emptyStatusCounts())

  return {
    ...response,
    data,
    total: response.total ?? 0,
    totalPages: response.totalPages ?? 1,
    status_counts_today: response.status_counts_today ?? statusCountsFallback,
    status_counts_range: response.status_counts_range ?? statusCountsFallback,
  }
}
