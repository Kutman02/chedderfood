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
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    
    // Показываем кнопку для всех кроме уже установленного приложения
    return !standalone
  })
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

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Для Android с событием beforeinstallprompt
      try {
        deferredPrompt.prompt()
        
        const { outcome } = await deferredPrompt.userChoice
        
        if (outcome === 'accepted') {
          console.log('App installed')
        }
        
        setDeferredPrompt(null)
        setShowButton(false)
      } catch (error) {
        console.error('Install error:', error)
      }
    } else {
      // Для iOS и других платформ
      const ua = window.navigator.userAgent.toLowerCase()
      const isIOSDevice = /iphone|ipad|ipod/.test(ua)
      
      if (isIOSDevice) {
        alert(
          'Чтобы установить приложение:\n\n1. Нажмите кнопку "Поделиться" в Safari\n2. Выберите "Добавить на экран Домой"\n3. Назовите приложение\n4. Нажмите "Добавить"'
        )
      } else {
        // Для других браузеров на Android
        alert(
          'Чтобы установить приложение:\n\n1. Откройте это приложение в Chrome или другом браузере\n2. Нажмите кнопку меню (три точки)\n3. Выберите "Установить приложение" или "Добавить на главный экран"'
        )
      }
    }
  }

  if (isStandalone || !showButton) return null

  return (
    <button
      onClick={handleInstall}
      className="w-full flex items-center gap-4 p-5 bg-orange-50 hover:bg-orange-100 rounded-2xl transition-all duration-200 text-left active:scale-[0.98] shadow-sm hover:shadow-md"
    >
      <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-lg">📱</span>
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-slate-800 text-base">Установить приложение</h3>
        <p className="text-sm text-slate-600">Установите PWA на телефон</p>
      </div>
    </button>
  )
}