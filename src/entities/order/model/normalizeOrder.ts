import type { Order } from "./types"

export const normalizeOrder = (o: any): Order => {

  /* ===============================
     BASIC
  =============================== */

  const firstName =
    o?.billing?.first_name ||
    o?.customer_name ||
    "Клиент"

  const lastName =
    o?.billing?.last_name || ""

  const phone =
    o?.phone ||
    o?.billing?.phone ||
    ""

  const address =
    o?.address ||
    o?.billing?.address_1 ||
    "Адрес не указан"

  /* ===============================
     META → OBJECT
  =============================== */

  const meta: Record<string, any> = {}

  if (Array.isArray(o?.meta_data)) {
    o.meta_data.forEach((m: any) => {
      if (m?.key) {
        meta[m.key] = m.value
      }
    })
  }

  /* ===============================
     DERIVED META
  =============================== */

  const orderType =
    meta.order_type === "pickup"
      ? "pickup"
      : "delivery"

  const pickupAddress =
    meta.pickup_address || ""

  /* ===============================
     ITEMS
  =============================== */

  const items = Array.isArray(o?.line_items)
    ? o.line_items.map((item: any) => ({

        id: Number(item?.id || 0),
        product_id: Number(item?.product_id || 0),

        name: item?.name || "Товар",

        quantity: Number(item?.quantity || 1),

        total: String(item?.total ?? "0"),
        price: String(item?.price ?? item?.total ?? "0"),

        image:
          typeof item?.image === "string"
            ? item.image
            : item?.image?.src || "",

      }))
    : []

  /* ===============================
     SYSTEM FIELDS
  =============================== */

  const currencyRaw = o?.currency || "KGS"

  const currency =
    currencyRaw === "KGS"
      ? "сом"
      : currencyRaw

  const shippingTotal =
    o?.shipping_total ??
    o?.shipping_lines?.[0]?.total ??
    "0"

  const paymentMethod =
    o?.payment_method_title ||
    meta.payment_method_title ||
    ""

  /* ===============================
     RESULT
  =============================== */

  return {
    id: Number(o?.id || 0),

    number: o?.number || o?.id,

    status: o?.status || "pending",

    total: String(o?.total ?? "0"),

    date_created: o?.date_created || "",
    date_modified: o?.date_modified || undefined, // 🔥 FIX

    customer_name: `${firstName} ${lastName}`.trim(),

    phone,
    address,

    customer_note: o?.customer_note || "",

    order_type: orderType,
    pickup_address: pickupAddress,

    payment_method_title: paymentMethod,

    currency,
    shipping_total: String(shippingTotal),

    meta,

    items,
  }
}