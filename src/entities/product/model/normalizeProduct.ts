import { normalizePrice } from "@/shared/lib/price"
import { stripHtml, decodeHtml } from "@/shared/lib/html"
import type { Product } from "./types"

export const normalizeProduct = (p: any): Product => {

  /* ===============================
     PRICE (🔥 SAFE)
  =============================== */

  const rawPrice =
    p?.price ||
    p?.prices?.price ||
    "0"

  /* ===============================
     IMAGES (🔥 CRITICAL FIX)
  =============================== */

  const images = Array.isArray(p?.images)
    ? p.images.map((img: any, i: number) => {

        // 🔥 если строка
        if (typeof img === "string") {
          return {
            id: i,
            src: img,
            name: "",
            alt: "",
          }
        }

        return {
          id: Number(img?.id || i),
          src: img?.src || "",
          name: img?.name || "",
          alt: img?.alt || "",
        }
      })
    : []

  /* ===============================
     RESULT
  =============================== */

  return {
    id: Number(p?.id || 0), // 🔥 КЛЮЧЕВОЙ ФИКС

    name: p?.name || "Без названия",

    /* ===============================
       PRICES
    =============================== */

    price: normalizePrice(rawPrice),

    regular_price: normalizePrice(
      p?.regular_price || rawPrice
    ),

    sale_price: p?.sale_price
      ? normalizePrice(p.sale_price)
      : "",

    /* ===============================
       DESCRIPTION
    =============================== */

    description: stripHtml(
      decodeHtml(p?.description || "")
    ),

    /* ===============================
       STATUS
    =============================== */

    status: p?.status || "publish",
    stock_status: p?.stock_status || "instock",

    /* ===============================
       SORT
    =============================== */

    menu_order: Number(p?.menu_order || 0),

    /* ===============================
       IMAGES
    =============================== */

    images,

    /* ===============================
       CATEGORIES
    =============================== */

    categories: Array.isArray(p?.categories)
      ? p.categories.map((c: any) => ({
          id: Number(c?.id || 0),
          name: c?.name || "",
        }))
      : [],

    /* ===============================
       TAGS
    =============================== */

    tags: Array.isArray(p?.tags)
      ? p.tags.map((t: any) => ({
          id: Number(t?.id || 0),
          name: t?.name || "",
          slug: t?.slug || "",
        }))
      : [],
  }
}