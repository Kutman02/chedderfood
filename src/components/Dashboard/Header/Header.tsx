import type { HeaderProps } from "./types"

import { Logo, HeaderActions } from "./components"

export const Header = ({
  showSettings,
  setShowSettings,
  userName
}: HeaderProps) => {

  return (

    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

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
