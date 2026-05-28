import Script from 'next/script';

/**
 * Google Analytics 4.
 *
 * Підключається через next/script зі стратегією afterInteractive —
 * скрипт завантажується після того як сторінка стала інтерактивною,
 * тому НЕ гальмує перший рендер (краще за сирий <script> тег).
 *
 * GA4 автоматично відстежує перегляди сторінок (page_view) при навігації.
 */
const GA_ID = 'G-H4JBRYV7QM';

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
