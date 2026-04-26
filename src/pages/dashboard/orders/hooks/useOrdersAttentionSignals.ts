import { useEffect } from "react"
import type { OrderStatus } from "@/types"
import { ON_HOLD_COUNT_SESSION_KEY } from "../orders.constants"

type UseOrdersAttentionSignalsParams = {
  activeTab: OrderStatus
  onHoldCount: number
}

export const useOrdersAttentionSignals = ({
  activeTab,
  onHoldCount,
}: UseOrdersAttentionSignalsParams) => {
  useEffect(() => {
    if (activeTab !== "on-hold") return

    const prevCount = Number(
      sessionStorage.getItem(ON_HOLD_COUNT_SESSION_KEY) || 0
    )

    if (onHoldCount > prevCount) {
      const audio = new Audio("/sounds/new-order.mp3")

      audio.play().catch(() => {
        console.warn("Звук заблокирован браузером")
      })

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Новый заказ!", {
          body: `Поступил новый заказ. Всего новых: ${onHoldCount}`,
          icon: "/logo192.png",
        })
      }
    }

    sessionStorage.setItem(
      ON_HOLD_COUNT_SESSION_KEY,
      String(onHoldCount)
    )
  }, [activeTab, onHoldCount])

  useEffect(() => {
    if (activeTab !== "on-hold") return

    const originalTitle = document.title

    if (onHoldCount <= 0) {
      document.title = originalTitle
      return
    }

    let visible = false

    const interval = window.setInterval(() => {
      document.title = visible
        ? `(${onHoldCount}) Новый заказ!`
        : originalTitle

      visible = !visible
    }, 3000)

    return () => {
      window.clearInterval(interval)
      document.title = originalTitle
    }
  }, [activeTab, onHoldCount])
}
