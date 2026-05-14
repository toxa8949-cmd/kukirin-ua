import Image from 'next/image';
import Link from 'next/link';

type LogoVariant = 'mark' | 'full' | 'inline';

interface LogoProps {
  variant?: LogoVariant;
  size?: number; // висота в px
  className?: string;
  href?: string | null; // null = без обгортки <a>
}

/**
 * Logo KUKIRIN
 *
 * Варіанти:
 * - mark — тільки кірін (символ), для компактних місць (хедер мобільний, favicon)
 * - full — кірін + текст "KuKirin" вертикально (для футера, big display)
 * - inline — кірін + текст "KUKIRIN.UA" горизонтально (для десктоп хедера)
 *
 * За замовчуванням загорнуто в <Link href="/"> щоб клік вів на головну.
 * Передай href={null} щоб вимкнути обгортку.
 */
export default function Logo({
  variant = 'inline',
  size = 32,
  className = '',
  href = '/',
}: LogoProps) {
  const content = (() => {
    if (variant === 'mark') {
      return (
        <Image
          src="/logo-mark.png"
          alt="KUKIRIN"
          width={size * 1.6}
          height={size}
          priority
          className="h-auto"
          style={{ height: size, width: 'auto' }}
        />
      );
    }

    if (variant === 'full') {
      return (
        <Image
          src="/logo-full.png"
          alt="KUKIRIN"
          width={size * 1.4}
          height={size}
          priority
          className="h-auto"
          style={{ height: size, width: 'auto' }}
        />
      );
    }

    // inline: іконка + текст
    return (
      <span className="inline-flex items-center gap-2">
        <Image
          src="/logo-mark.png"
          alt=""
          width={size * 1.5}
          height={size}
          priority
          style={{ height: size, width: 'auto' }}
        />
        <span className="text-base font-medium tracking-[0.15em] sm:text-lg">
          KUKIRIN<span className="text-[#FF6B00]">.</span>UA
        </span>
      </span>
    );
  })();

  if (href === null) {
    return <span className={className}>{content}</span>;
  }

  return (
    <Link href={href} className={className} aria-label="KUKIRIN.UA — головна">
      {content}
    </Link>
  );
}
