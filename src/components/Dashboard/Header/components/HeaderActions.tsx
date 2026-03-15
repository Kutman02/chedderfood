import { FaCog } from "react-icons/fa"
import { useRef, useEffect } from "react"

import { StatsButton } from "./StatsButton"
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

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }

  }, [setShowSettings])

  return (

    <div
      ref={containerRef}
      className="flex items-center gap-3 relative"
    >

      <StatsButton />

      <button
        onClick={() => setShowSettings(true)}
        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 transition"
      >
        <FaCog />
      </button>

      {showSettings && (
        <SettingsDropdown userName={userName} />
      )}

    </div>

  )
}
