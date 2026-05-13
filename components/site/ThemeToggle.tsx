'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

type Theme = 'light' | 'dark' | 'auto';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('auto');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('kukirin-theme') as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
    } else {
      setTheme('auto');
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    if (theme === 'auto') {
      // Видаляємо ручний override, далі дивимось на ОС
      localStorage.removeItem('kukirin-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        html.setAttribute('data-theme', 'dark');
      } else {
        html.removeAttribute('data-theme');
      }
    } else {
      html.setAttribute('data-theme', theme);
      localStorage.setItem('kukirin-theme', theme);
    }
  }, [theme, mounted]);

  const cycle: Record<Theme, Theme> = {
    auto: 'light',
    light: 'dark',
    dark: 'auto',
  };

  const handleClick = () => setTheme(cycle[theme]);

  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
  const label =
    theme === 'auto'
      ? 'Тема: авто. Натисніть для світлої.'
      : theme === 'light'
      ? 'Тема: світла. Натисніть для темної.'
      : 'Тема: темна. Натисніть для авто.';

  if (!mounted) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      title={label}
      className="fixed top-3 right-3 z-[200] inline-flex h-9 w-9 items-center justify-center rounded-sm border border-[#E8E6DE] bg-white/70 text-[#4A4A48] backdrop-blur transition hover:border-[#FF6B00] hover:text-[#FF6B00] dark:border-white/10 dark:bg-black/40 dark:text-white/70"
    >
      <Icon size={16} />
    </button>
  );
}
