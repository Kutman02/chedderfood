import { FaBars, FaCog } from "react-icons/fa"
import { useRef, useEffect } from "react"

import { SettingsDropdown } from "./SettingsDropdown"

interface Props {
  showSettings: boolean
  setShowSettings: (val: boolean) => void
  userName: string | null
}

export const HeaderActions = ({
  showSettings,
  setShowSettings,
  userName
}: Props) => {

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const targetNode = event.target as Node | null

      if (!targetNode) {
        return
      }

      const dropdownRoots = document.querySelectorAll("[data-admin-settings-dropdown='true']")
      const clickInsideDropdown = Array.from(dropdownRoots).some((root) =>
        root.contains(targetNode)
      )

      if (clickInsideDropdown) {
        return
      }

      if (
        containerRef.current &&
        !containerRef.current.contains(targetNode)
      ) {
        setShowSettings(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }

  }, [setShowSettings])

  return (

    <div
      ref={containerRef}
      className="flex items-center gap-3 relative"
    >

      <button
        onClick={() => setShowSettings(!showSettings)}
        aria-label="Открыть настройки"
        className="hidden md:flex w-10 h-10 items-center justify-center rounded-lg hover:bg-slate-100 transition"
      >
        <FaCog />
      </button>

      <button
        onClick={() => setShowSettings(!showSettings)}
        aria-label="Открыть меню администратора"
        className="flex md:hidden w-10 h-10 items-center justify-center rounded-lg hover:bg-slate-100 text-slate-700 transition"
      >
        <FaBars size={18} />
      </button>

      {showSettings && (
        <SettingsDropdown
          userName={userName}
          onClose={() => setShowSettings(false)}
        />
      )}

    </div>

  )
}
