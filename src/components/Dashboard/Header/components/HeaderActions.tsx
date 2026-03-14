import { FaCog } from "react-icons/fa"

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

  return (

    <div className="flex items-center gap-3 relative">

      <StatsButton />

      <button
        onClick={() => setShowSettings(!showSettings)}
        className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center"
      >
        <FaCog />
      </button>

      {showSettings && (

        <SettingsDropdown
          userName={userName}
        />

      )}

    </div>

  )

}
