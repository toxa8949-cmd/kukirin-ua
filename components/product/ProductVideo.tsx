/**
 * Embed YouTube відео-огляду для сторінки товара.
 * Рендериться як секція з заголовком; розмітка VideoObject — окремо в JsonLd.
 *
 * Сервер-компонент, без 'use client' — простий iframe.
 */
export default function ProductVideo({
  youtubeId,
  title,
}: {
  youtubeId: string;
  title?: string;
}) {
  return (
    <section className="mt-16 border-t border-[#E8E6DE] dark:border-white/10 pt-10">
      <div className="mb-2 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">
        // ВІДЕО-ОГЛЯД
      </div>
      <h2 className="mb-6 text-2xl font-medium tracking-tight sm:text-3xl">
        {title || 'Подивитись в дії'}
      </h2>
      <div className="aspect-video w-full overflow-hidden rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
          title={title || 'Огляд KUKIRIN'}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    </section>
  );
}
