interface InstallButtonUIProps {
  onClick: () => void
}

export const InstallButtonUI = ({ onClick }: InstallButtonUIProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-orange-600 text-white px-4 py-3 rounded-xl shadow-lg"
    >
      Установить приложение
    </button>
  )
}