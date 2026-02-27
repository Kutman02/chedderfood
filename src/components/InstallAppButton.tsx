import { useEffect, useState, useRef } from 'react'

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
  const [showButton, setShowButton] = useState<boolean>(() => {
    // Инициализируем правильно при первом рендере
    const ua = window.navigator.userAgent.toLowerCase()
    const isIOS = /iphone|ipad|ipod/.test(ua)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true

    // Показываем кнопку если:
    // - Приложение еще не установлено (не standalone)
    // - И это либо iOS, либо Android (где придет beforeinstallprompt)
    return !isStandalone && (isIOS || typeof window !== 'undefined')
  })
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null)
  const isIOSRef = useRef(false)
  const isStandaloneRef = useRef(false)

  useEffect(() => {
    // Определяем платформу
    const ua = window.navigator.userAgent.toLowerCase()
    isIOSRef.current = /iphone|ipad|ipod/.test(ua)
    isStandaloneRef.current = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true

    console.log('Platform detection:', { isIOS: isIOSRef.current, isStandalone: isStandaloneRef.current })

    // На iOS кнопка уже видна для инструкции
    if (isIOSRef.current) {
      return
    }

    // На Android слушаем событие beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const evt = e as BeforeInstallPromptEvent
      deferredPromptRef.current = evt
      console.log('✓ beforeinstallprompt event captured')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    console.log('Install button clicked', { hasPrompt: !!deferredPromptRef.current, isIOS: isIOSRef.current })

    // Для Android - вызиваем prompt() аппаратного диалога
    if (deferredPromptRef.current) {
      try {
        console.log('Showing install prompt...')
        await deferredPromptRef.current.prompt()
        
        const { outcome } = await deferredPromptRef.current.userChoice
        console.log('Install outcome:', outcome)
        
        if (outcome === 'accepted') {
          console.log('✓ App installed successfully')
          deferredPromptRef.current = null
          setShowButton(false)
        }
      } catch (error) {
        console.error('Install prompt error:', error)
      }
    }
    // Для iOS - показываем инструкцию
    else if (isIOSRef.current) {
      alert(
        'Чтобы установить приложение:\n\n1️⃣ Нажмите кнопку "Поделиться" в Safari\n2️⃣ Выберите "Добавить на экран Домой"\n3️⃣ Назовите приложение\n4️⃣ Нажмите "Добавить"'
      )
    }
    // Другие платформы
    else {
      alert(
        'Чтобы установить приложение:\n\n1. Откройте в Chrome\n2. Нажмите меню (⋮)\n3. Выберите "Установить приложение"'
      )
    }
  }

  if (!showButton) return null

  return (
    <button
      onClick={handleInstall}
      className="w-full flex items-center gap-4 p-5 bg-orange-50 hover:bg-orange-100 rounded-2xl transition-all duration-200 text-left active:scale-[0.98] shadow-sm hover:shadow-md"
    >
      <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-lg">📱</span>
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-slate-800 text-base">Инструкция по установке</h3>
        <p className="text-sm text-slate-600">Установите PWA на ваш телефон</p>
      </div>
    </button>
  )
}