import type { Product } from "@/types"

/* =========================
   HELPERS
========================= */

// 🔥 декод HTML сущностей (&8212; и т.д.)
const decodeHtml = (html: string): string => {
  const txt = document.createElement("textarea")
  txt.innerHTML = html
  return txt.value
}

// 🔥 убираем HTML теги
const stripHtml = (html: string): string => {
  const div = document.createElement("div")
  div.innerHTML = html
  return div.textContent || div.innerText || ""
}

// 🔥 нормализация цены WooCommerce (делим на 100)
const normalizePrice = (value: any): string => {
  if (!value) return "0"

  const num = Number(value)

  if (isNaN(num)) return "0"

  return String(num / 100)
}

/* =========================
   NORMALIZE PRODUCT
========================= */

export const normalizeProduct = (product: any): Product => {
  // 🔥 raw цены из разных API
  const rawPrice =
    product.price ||
    product.prices?.price ||
    "0"

  const rawRegular =
    product.regular_price ||
    product.prices?.regular_price ||
    rawPrice

  const rawSale =
    product.sale_price ||
    product.prices?.sale_price ||
    ""

  return {
    id: product.id,

    name: product.name,
    slug: product.slug || "",
    permalink: product.permalink || "",

    type: product.type || "simple",
    status: product.status || "publish",

    featured: product.featured || false,
    catalog_visibility: product.catalog_visibility || "visible",

    // 🔥 чистим описание
    description: stripHtml(decodeHtml(product.description || "")),
    short_description: stripHtml(decodeHtml(product.short_description || "")),

    sku: product.sku || "",

    // 🔥 ГЛАВНЫЙ ФИКС (цены)
    price: normalizePrice(rawPrice),
    regular_price: normalizePrice(rawRegular),
    sale_price: rawSale ? normalizePrice(rawSale) : "",

    weight: product.weight,

    date_created: product.date_created || "",
    date_modified: product.date_modified || "",

    stock_status: product.stock_status || "instock",
    stock_quantity: product.stock_quantity ?? null,

    menu_order: product.menu_order || 0,
    total_sales: product.total_sales || 0,

    images: product.images || [],
    categories: product.categories || [],
    tags: product.tags || [],
  }
}