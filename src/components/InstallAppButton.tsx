import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

export const InstallAppButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS] = useState<boolean>(() => {
    const ua = window.navigator.userAgent.toLowerCase()
    return /iphone|ipad|ipod/.test(ua)
  })
  const [isStandalone] = useState<boolean>(() => {
    return window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  })
  const [showButton, setShowButton] = useState<boolean>(() => {
    // Инициализируем правильно при первом рендере
    const ua = window.navigator.userAgent.toLowerCase()
    const ios = /iphone|ipad|ipod/.test(ua)
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    
    // На iOS показываем кнопку, на Android - ждем события
    return ios && !standalone
  })
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase()
    const ios = /iphone|ipad|ipod/.test(ua)
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true

    if (standalone || ios) return

    // На Android слушаем события beforeinstallprompt
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowButton(true)
    }

    window.addEventListener('beforeinstallprompt', handler as EventListener)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler as EventListener)
    }
  }, [])

  // Проверяем открыто ли меню
  useEffect(() => {
    const checkMenuOpen = () => {
      // Проверяем наличие фона меню (fixed позиционирование с overlay)
      const menuOpen = !!document.querySelector('[class*="fixed"][class*="inset-0"][class*="bg-black"]')
      setIsMenuOpen(menuOpen)
    }

    // Проверяем сразу
    checkMenuOpen()

    // Слушаем изменения класса в документе
    const observer = new MutationObserver(checkMenuOpen)
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => observer.disconnect()
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('App installed')
      }
      
      setDeferredPrompt(null)
      setShowButton(false)
    } else if (isIOS) {
      alert(
        'Чтобы установить приложение:\n\nНажмите кнопку "Поделиться" в Safari\nи выберите "Добавить на экран Домой"'
      )
    }
  }

  if (isStandalone || !showButton || isMenuOpen) return null

  return (
    <button
      onClick={handleInstall}
      className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 z-40"
    >
      Установить приложение
    </button>
  )
}