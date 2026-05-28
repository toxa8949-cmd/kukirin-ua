import Image from 'next/image';
import Link from 'next/link';

type LogoVariant = 'mark' | 'full' | 'inline';

interface LogoProps {
  variant?: LogoVariant;
  size?: number; // висота в px
  className?: string;
  href?: string | null; // null = без обгортки <a>
  priority?: boolean; // тільки для above-the-fold (header, hero)
}

/**
 * Logo Kukirin
 *
 * Варіанти:
 * - mark — тільки кірін (символ), для компактних місць (хедер мобільний, favicon)
 * - full — кірін + текст "Kukirin" вертикально (для футера, big display)
 * - inline — кірін + текст "Kukirin" горизонтально (для десктоп хедера)
 *
 * За замовчуванням загорнуто в <Link href="/">. Передай href={null} щоб вимкнути.
 *
 * Performance: розміри статичні (width × height) → Next.js не шукає natural size,
 * автоматично генерує WebP, ленива загрузка крім priority=true.
 */
export default function Logo({
  variant = 'inline',
  size = 32,
  className = '',
  href = '/',
  priority = false,
}: LogoProps) {
  // Pixel ratio адаптується автоматично через sizes
  const content = (() => {
    if (variant === 'mark') {
      // Натуральне співвідношення logo-mark: 384 × 242 → 1.59
      return (
        <Image
          src="/logo-mark.png"
          alt="Kukirin"
          width={Math.round(size * 1.59)}
          height={size}
          priority={priority}
          style={{ height: size, width: 'auto' }}
        />
      );
    }

    if (variant === 'full') {
      // Натуральне співвідношення logo-full: 500 × 360 → 1.39
      return (
        <Image
          src="/logo-full.png"
          alt="Kukirin"
          width={Math.round(size * 1.39)}
          height={size}
          priority={priority}
          style={{ height: size, width: 'auto' }}
        />
      );
    }

    // inline: іконка дракона + напис-wordmark (PNG, вирізаний з оригіналу)
    return (
      <span className="inline-flex items-center gap-2">
        <Image
          src="/logo-mark.png"
          alt=""
          width={Math.round(size * 1.59)}
          height={size}
          priority={priority}
          style={{ height: size, width: 'auto' }}
        />
        <Image
          src="/logo-wordmark.png"
          alt="Kukirin"
          width={Math.round(size * 0.62 * 5.62)}
          height={Math.round(size * 0.62)}
          priority={priority}
          style={{ height: Math.round(size * 0.62), width: 'auto' }}
        />
      </span>
    );
  })();

  if (href === null) {
    return <span className={className}>{content}</span>;
  }

  return (
    <Link href={href} className={className} aria-label="Kukirin — головна">
      {content}
    </Link>
  );
}
