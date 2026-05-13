import type { Metadata } from 'next';
import './globals.css';
import ThemeToggle from '@/components/site/ThemeToggle';

export const metadata: Metadata = {
  metadataBase: new URL('https://kukirin.ua'),
  title: {
    default: 'KUKIRIN Україна — електросамокати з гарантією',
    template: '%s | KUKIRIN.UA',
  },
  description:
    'Офіційний дистриб’ютор KUKIRIN в Україні. Електросамокати G2 Pro, G2 Master, G4 Max, M4 Pro. Гарантія 12 міс, доставка 1–3 дні, розстрочка 0%.',
  keywords: [
    'kukirin',
    'кукірін',
    'електросамокат',
    'kukirin g2 pro',
    'kukirin g4 max',
    'kukirin україна',
    'купити електросамокат',
  ],
  openGraph: {
    title: 'KUKIRIN Україна — електросамокати з гарантією',
    description:
      'Офіційний KUKIRIN в Україні. До 70 км/год, 2000W, гарантія 12 міс.',
    type: 'website',
    locale: 'uk_UA',
    siteName: 'KUKIRIN.UA',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KUKIRIN.UA — FEEL THE RUSH',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KUKIRIN Україна — електросамокати з гарантією',
    description:
      'Офіційний KUKIRIN в Україні. До 70 км/год, 2000W, гарантія 12 міс.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Скрипт виконується ДО першого рендеру щоб уникнути flash:
// - якщо в localStorage є ручний вибір — застосовуємо його
// - якщо немає — дивимось на ОС
const themeInitScript = `(function(){
  try {
    var t = localStorage.getItem('kukirin-theme');
    if (t === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (t === 'light') {
      // нічого не робимо — світла за замовч.
    } else {
      // auto: дивимось на ОС
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }
  } catch (e) {}
})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
