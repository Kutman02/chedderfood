import type { HeaderProps } from "./types"

import { Logo } from "./components/Logo"
import { HeaderActions } from "./components/HeaderActions"

export const Header = ({
  showSettings,
  setShowSettings,
  userName
}: HeaderProps) => {

  return (

    <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-md shadow-sm">

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        <Logo />

        <HeaderActions
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          userName={userName}
        />

      </div>

    </header>

  )
}
