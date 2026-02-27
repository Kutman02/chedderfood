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
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  // Определяем платформу и режим отображения
  const ua = window.navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  const isAndroid = /android/.test(ua);

  // Кнопка показывается только если не standalone и это iOS или Android
  const shouldShowButton = !isStandalone && (isIOS || isAndroid);

  const [showButton, setShowButton] = useState(shouldShowButton);

  useEffect(() => {
    // На Android слушаем событие beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const evt = e as BeforeInstallPromptEvent;
      deferredPromptRef.current = evt;
      setShowButton(true);
      console.log('✓ beforeinstallprompt event captured');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    // Для Android - вызиваем prompt() аппаратного диалога
    if (deferredPromptRef.current) {
      try {
        await deferredPromptRef.current.prompt();
        const { outcome } = await deferredPromptRef.current.userChoice;
        if (outcome === 'accepted') {
          deferredPromptRef.current = null;
          setShowButton(false);
        }
      } catch {
        alert('Ошибка установки приложения. Попробуйте позже.');
      }
      return;
    }
    // Для iOS - показываем инструкцию
    if (isIOS) {
      alert(
        'Чтобы установить приложение на iPhone/iPad:\n\n1️⃣ Откройте сайт в Safari\n2️⃣ Нажмите кнопку "Поделиться" (квадрат со стрелкой вверх)\n3️⃣ Выберите "Добавить на экран Домой"\n4️⃣ Подтвердите установку'
      );
      return;
    }
    // Для десктопа и fallback
    alert(
      'Чтобы установить приложение:\n\n1. Откройте сайт в Google Chrome на Android\n2. Нажмите меню (⋮)\n3. Выберите "Установить приложение" или "Add to Home screen"'
    );
  };

  return (
    <>
      {showButton && (
        <button
          onClick={handleInstall}
          className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all active:scale-95 text-sm font-medium"
          title="Установить приложение на телефон"
        >
          <FaArrowDown size={12} className="animate-bounce" />
          <span>Установить приложение</span>
        </button>
      )}
    </>
  );
};
