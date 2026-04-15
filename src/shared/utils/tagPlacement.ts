import type { Tag } from "@/types"

const normalize = (value?: string) => (value ?? "").toLowerCase().trim()

const includesAny = (value: string, keywords: string[]) =>
  keywords.some((keyword) => value.includes(keyword))

const SALE_KEYWORDS = ["sale", "discount", "скид", "распродаж"]
const TOP_KEYWORDS = ["hit", "new", "chef", "top", "promo", "хит", "новин", "рекоменд"]

export const isSaleTag = (tag: Pick<Tag, "name" | "slug">) => {
  const value = `${normalize(tag.slug)} ${normalize(tag.name)}`
  return includesAny(value, SALE_KEYWORDS)
}

export const isTopPlacementTag = (tag: Pick<Tag, "name" | "slug">) => {
  if (isSaleTag(tag)) return true

  const value = `${normalize(tag.slug)} ${normalize(tag.name)}`
  return includesAny(value, TOP_KEYWORDS)
}

export const isBottomPlacementTag = (tag: Pick<Tag, "name" | "slug">) => !isTopPlacementTag(tag)

export const getSaleTagId = (tags: Tag[] = []) => tags.find((tag) => isSaleTag(tag))?.id
