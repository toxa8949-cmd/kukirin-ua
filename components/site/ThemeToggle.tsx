'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

type Theme = 'light' | 'dark' | 'auto';

/**
 * Плаваюча кнопка перемикання теми.
 * Фіксується в правому верхньому куті сайту.
 * Не потребує змін у Header.
 */
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
      html.removeAttribute('data-theme');
      localStorage.removeItem('kukirin-theme');
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
      style={{
        position: 'fixed',
        top: '14px',
        right: '14px',
        zIndex: 200,
        width: '36px',
        height: '36px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        color: 'rgba(255, 255, 255, 0.7)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#FF6B00';
        e.currentTarget.style.borderColor = 'rgba(255, 107, 0, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      }}
    >
      <Icon size={16} />
    </button>
  );
}
