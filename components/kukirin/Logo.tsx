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
 */
export default function Logo({
  variant = 'inline',
  size = 32,
  className = '',
  href = '/',
  priority = false,
}: LogoProps) {
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

    // inline: іконка дракона + напис-wordmark.
    // Напис трохи більший і опущений униз через marginTop, щоб його базова
    // лінія збіглася з оптичним центром дракона. Контейнер вирівнюється
    // по верху (items-start), а точне положення задає marginTop на написі.
    const wordmarkHeight = Math.round(size * 0.72);
    const drop = Math.round(size * 0.16); // на скільки px опустити напис
    return (
      <span className="inline-flex items-start gap-2">
        <Image
          src="/logo-mark.png"
          alt=""
          width={Math.round(size * 1.59)}
          height={size}
          priority={priority}
          style={{ height: size, width: 'auto', display: 'block' }}
        />
        <Image
          src="/logo-wordmark.png"
          alt="Kukirin"
          width={Math.round(wordmarkHeight * 5.62)}
          height={wordmarkHeight}
          priority={priority}
          style={{
            height: wordmarkHeight,
            width: 'auto',
            display: 'block',
            marginTop: drop,
          }}
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
