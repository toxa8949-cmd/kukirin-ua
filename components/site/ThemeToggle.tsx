'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

type Theme = 'light' | 'dark' | 'auto';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('auto');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('kukirin-theme') as Theme | null;
    if (stored === 'light' || stored === 'dark') setTheme(stored);
    else setTheme('auto');
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    if (theme === 'auto') {
      localStorage.removeItem('kukirin-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) html.setAttribute('data-theme', 'dark');
      else html.removeAttribute('data-theme');
    } else {
      html.setAttribute('data-theme', theme);
      localStorage.setItem('kukirin-theme', theme);
    }
  }, [theme, mounted]);

  const cycle: Record<Theme, Theme> = { auto: 'light', light: 'dark', dark: 'auto' };
  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
  const label =
    theme === 'auto' ? 'Тема: авто. Натисніть для світлої.'
    : theme === 'light' ? 'Тема: світла. Натисніть для темної.'
    : 'Тема: темна. Натисніть для авто.';

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={() => setTheme(cycle[theme])}
      aria-label={label}
      title={label}
      className="fixed bottom-4 right-4 z-[200] inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E6DE] bg-white/90 text-[#4A4A48] shadow-lg backdrop-blur transition hover:border-[#FF6B00] hover:text-[#FF6B00] dark:border-white/10 dark:bg-black/60 dark:text-white/70"
    >
      <Icon size={16} />
    </button>
  );
}
