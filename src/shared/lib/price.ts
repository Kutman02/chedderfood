export const normalizePrice = (value: any): string => {
  if (!value) return "0"

  const num = Number(value)
  if (isNaN(num)) return "0"

  // wc/store → копейки
  if (num > 10000) return String(num / 100)

  return String(num)
}