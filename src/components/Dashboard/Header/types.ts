export interface HeaderProps {
  showSettings: boolean
  setShowSettings: (val: boolean) => void
  showStats: boolean
  setShowStats: (val: boolean) => void
  userName: string | null
}