import type { Metadata } from 'next';
import './globals.css';
import ThemeToggle from '@/components/site/ThemeToggle';
import GoogleAnalytics from '@/components/site/GoogleAnalytics';

export const metadata: Metadata = {
  metadataBase: new URL('https://kukirinstore.com.ua'),
  title: {
    default: 'KUKIRIN Україна — електросамокати з гарантією',
    template: '%s | KUKIRIN.UA',
  },
  description:
    'Офіційний дистриб’ютор KUKIRIN в Україні. Електросамокати G2 Pro, G2 Master, G4 Max, M4 Pro. Офіційна гарантія, доставка Новою Поштою, розтермінування.',
  keywords: ['kukirin', 'кукірін', 'електросамокат', 'kukirin g2 pro', 'kukirin g4 max', 'kukirin україна', 'купити електросамокат'],
  // НЕ задаємо тут alternates.canonical: '/' — інакше це каскадно
  // ставить canonical='/' на ВСІ сторінки сайту, через що Google може
  // ігнорувати товари, категорії й статті як дублікати головної.
  // Canonical для кожної сторінки задається в її власному generateMetadata.
  openGraph: {
    title: 'KUKIRIN Україна — електросамокати з гарантією',
    description: 'Офіційний KUKIRIN в Україні. До 70 км/год, 2000W, офіційна гарантія.',
    type: 'website', locale: 'uk_UA', siteName: 'KUKIRIN.UA',
    url: 'https://kukirinstore.com.ua',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'KUKIRIN.UA — FEEL THE RUSH' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KUKIRIN Україна — електросамокати з гарантією',
    description: 'Офіційний KUKIRIN в Україні. До 70 км/год, 2000W, офіційна гарантія.',
    images: ['/og-image.png'],
  },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  robots: { index: true, follow: true },
};

const themeInitScript = `(function(){
  try {
    // Темна тема вмикається ТІЛЬКИ якщо користувач сам її обрав кнопкою.
    // За замовчуванням (і коли вибору ще немає) — завжди світла,
    // системну тему НЕ враховуємо.
    var t = localStorage.getItem('kukirin-theme');
    if (t === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch (e) {}
})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {children}
        <ThemeToggle />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
