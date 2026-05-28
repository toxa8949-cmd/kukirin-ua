import Link from 'next/link';
import PageShell from '@/components/kukirin/PageShell';
import JsonLd, { blogSchema, breadcrumbSchema } from '@/components/seo/JsonLd';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 300; // кеш 5 хв
export const metadata = {
  title: 'Блог · KUKIRIN.UA',
  description: 'Новини, огляди та поради про електросамокати Kukirin.',
};

type NewsCard = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  published_at: string | null;
};

export default async function BlogIndexPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('news')
    .select('id, slug, title, excerpt, cover_url, published_at')
    .eq('published', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(50);

  if (error) {
    console.error('BlogIndexPage:', error);
  }
  const items = (data ?? []) as unknown as NewsCard[];

  return (
    <PageShell
      breadcrumb="BLOG"
      title="Блог"
      subtitle="Новини, огляди, технічні поради й порівняння моделей KUKIRIN."
    >
      {/* SEO: Blog + BreadcrumbList */}
      <JsonLd
        data={[
          blogSchema(
            items.map((n) => ({
              title: n.title,
              slug: n.slug,
              excerpt: n.excerpt,
              image: n.cover_url,
              publishedAt: n.published_at,
            }))
          ),
          breadcrumbSchema([
            { name: 'Головна', url: '/' },
            { name: 'Блог', url: '/blog' },
          ]),
        ]}
      />

      {items.length === 0 ? (
        <div className="rounded-sm border border-dashed border-[#E8E6DE] dark:border-white/15 bg-[#FAFAF7] dark:bg-[#0A0A0A] p-12 text-center">
          <p className="text-sm text-[#4A4A48] dark:text-white/55">
            Поки що тут порожньо. Перші статті зʼявляться найближчим часом.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((n) => (
            <li key={n.id}>
              <Link
                href={`/blog/${n.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] transition hover:border-[#FF6B00]/40"
              >
                <div className="aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
                  {n.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={n.cover_url}
                      alt={n.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] tracking-[0.2em] text-[#6C6A65] dark:text-white/30">
                      KUKIRIN.UA
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  {n.published_at && (
                    <div className="mb-2 text-[10px] tracking-[0.15em] text-[#6C6A65] dark:text-white/40">
                      {new Date(n.published_at).toLocaleDateString('uk-UA', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  )}
                  <h2 className="line-clamp-2 text-lg font-medium leading-snug tracking-tight transition group-hover:text-[#993C1D] dark:group-hover:text-[#FF8A33]">
                    {n.title}
                  </h2>
                  {n.excerpt && (
                    <p className="mt-2 line-clamp-3 text-sm text-[#4A4A48] dark:text-white/55">{n.excerpt}</p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
