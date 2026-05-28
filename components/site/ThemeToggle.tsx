'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

type Theme = 'light' | 'dark';

export default function ThemeToggle() {
  // За замовчуванням завжди світла. Системну тему НЕ враховуємо.
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('kukirin-theme');
    // Темна — тільки якщо користувач сам її обрав раніше.
    setTheme(stored === 'dark' ? 'dark' : 'light');
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('kukirin-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
      localStorage.setItem('kukirin-theme', 'light');
    }
  }, [theme, mounted]);

  const Icon = theme === 'dark' ? Moon : Sun;
  const label =
    theme === 'dark'
      ? 'Тема: темна. Натисніть для світлої.'
      : 'Тема: світла. Натисніть для темної.';

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={label}
      title={label}
      className="fixed bottom-4 right-4 z-[200] inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E6DE] bg-white/90 text-[#4A4A48] shadow-lg backdrop-blur transition hover:border-[#FF6B00] hover:text-[#FF6B00] dark:border-white/10 dark:bg-black/60 dark:text-white/70"
    >
      <Icon size={16} />
    </button>
  );
}
