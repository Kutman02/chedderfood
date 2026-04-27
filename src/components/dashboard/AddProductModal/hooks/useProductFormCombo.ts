import { useCallback, useState } from "react"

export const useProductFormCombo = () => {
  const [isCombo, setIsCombo] = useState(false)
  const [comboItems, setComboItems] = useState<string[]>([""])

  const addComboItem = useCallback(() => {
    setComboItems((previous) => [...previous, ""])
  }, [])

  const updateComboItem = useCallback((index: number, value: string) => {
    setComboItems((previous) => {
      return previous.map((item, itemIndex) => {
        return itemIndex === index ? value : item
      })
    })
  }, [])

  const removeComboItem = useCallback((index: number) => {
    setComboItems((previous) => {
      return previous.filter((_, itemIndex) => itemIndex !== index)
    })
  }, [])

  const buildDescriptionWithCombo = useCallback((description: string) => {
    if (!isCombo) {
      return description
    }

    const items = comboItems
      .map((item) => item.trim())
      .filter(Boolean)

    if (items.length === 0) {
      return description
    }

    return [
      description.trim(),
      "",
      "Состав комбо:",
      ...items.map((item) => `• ${item}`),
    ].join("\n")
  }, [comboItems, isCombo])

  return {
    isCombo,
    setIsCombo,
    comboItems,
    addComboItem,
    updateComboItem,
    removeComboItem,
    buildDescriptionWithCombo,
  }
}
