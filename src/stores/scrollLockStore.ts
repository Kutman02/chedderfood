import { create } from 'zustand';

interface ScrollLockState {
  isLocked: boolean;
  scrollY: number;
  lock: () => void;
  unlock: () => void;
}

export const useScrollLockStore = create<ScrollLockState>((set, get) => ({
  isLocked: false,
  scrollY: 0,
  lock: () => {
    if (typeof window === 'undefined') return;
    const { isLocked } = get();
    if (isLocked) return;

    const scrollY = window.scrollY;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    set({ isLocked: true, scrollY });
  },
  unlock: () => {
    if (typeof window === 'undefined') return;
    const { isLocked, scrollY } = get();
    if (!isLocked) return;

    const top = document.body.style.top;

    const restoredY = top ? Math.abs(parseInt(top, 10)) : scrollY;

    // Важно: убираем fixed-стили и сразу же синхронно восстанавливаем scroll,
    // иначе браузер успевает поставить scrollY=0 и потом делает “плавный” скролл обратно.
    const root = document.documentElement;
    const prevScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';

    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';

    window.scrollTo(0, restoredY);

    requestAnimationFrame(() => {
      root.style.scrollBehavior = prevScrollBehavior;
      set({ isLocked: false });
    });
  },
}));
