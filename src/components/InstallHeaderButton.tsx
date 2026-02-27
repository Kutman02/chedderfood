import { useEffect, useRef, useState } from 'react'
import { FaArrowDown } from 'react-icons/fa'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

export const InstallHeaderButton = () => {
  const [showButton, setShowButton] = useState<boolean>(() => {
    // Инициализируем правильно при первом рендере
    const ua = window.navigator.userAgent.toLowerCase()
    const isIOS = /iphone|ipad|ipod/.test(ua)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true

    // Показываем кнопку если приложение не установлено и это iOS или Android
    return !isStandalone && (isIOS || typeof window !== 'undefined')
  })
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null)
  const isIOSRef = useRef(false)

  useEffect(() => {
    // Определяем платформу
    const ua = window.navigator.userAgent.toLowerCase()
    isIOSRef.current = /iphone|ipad|ipod/.test(ua)

    // На iOS кнопка уже видна
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
  }

  if (!showButton) return null

  return (
    <button
      onClick={handleInstall}
      className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all active:scale-95 text-sm font-medium"
      title="Установить приложение на телефон"
    >
      <FaArrowDown size={12} className="animate-bounce" />
      <span>Установить</span>
    </button>
  )
}
