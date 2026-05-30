import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import PageShell from '@/components/kukirin/PageShell';
import JsonLd, { articleSchema, breadcrumbSchema } from '@/components/seo/JsonLd';
import { createClient } from '@/lib/supabase/server';
import { renderMarkdown } from '@/lib/markdown';

export const revalidate = 600; // кеш 10 хв

type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_url: string | null;
  published_at: string | null;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('news')
    .select('title, excerpt, cover_url')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  const row = data as { title: string; excerpt: string | null; cover_url: string | null } | null;
  if (!row) return { title: 'Стаття · kukirinstore.com.ua' };
  return {
    title: `${row.title} · kukirinstore.com.ua`,
    description: row.excerpt ?? undefined,
    openGraph: row.cover_url ? { images: [row.cover_url] } : undefined,
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('news')
    .select('id, slug, title, excerpt, content, cover_url, published_at')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error) console.error('BlogArticlePage:', error);
  if (!data) notFound();
  const article = data as unknown as Article;
  const html = renderMarkdown(article.content);

  // Fetch a couple of other articles as "recommended".
  const { data: others } = await supabase
    .from('news')
    .select('id, slug, title, cover_url, published_at')
    .eq('published', true)
    .neq('id', article.id)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(3);
  const related = (others ?? []) as Array<{
    id: string;
    slug: string;
    title: string;
    cover_url: string | null;
    published_at: string | null;
  }>;

  return (
    <PageShell breadcrumb="BLOG">
      <JsonLd
        data={[
          articleSchema({
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt,
            image: article.cover_url,
            publishedAt: article.published_at,
            // Поки в news немає updated_at — використовуємо published_at
            // як dateModified (валідно для Google).
            updatedAt: article.published_at,
          }),
          breadcrumbSchema([
            { name: 'Головна', url: '/' },
            { name: 'Блог', url: '/blog' },
            { name: article.title, url: `/blog/${article.slug}` },
          ]),
        ]}
      />
      <article className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="mb-6 inline-flex items-center gap-1 text-xs text-[#4A4A48] dark:text-white/55 hover:text-[#1a1a1a] dark:hover:text-white"
        >
          <ArrowLeft size={12} /> Усі статті
        </Link>

        {article.published_at && (
          <div className="mb-3 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">
            {new Date(article.published_at).toLocaleDateString('uk-UA', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        )}

        <h1 className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="mt-4 text-lg text-[#4A4A48] dark:text-white/65">{article.excerpt}</p>
        )}

        {article.cover_url && (
          <div className="mt-8 overflow-hidden rounded-sm border border-[#E8E6DE] dark:border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.cover_url}
              alt={article.title}
              className="w-full object-cover"
            />
          </div>
        )}

        {html ? (
          <div
            className="prose-kukirin mt-10"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <p className="mt-10 text-sm italic text-[#6C6A65] dark:text-white/40">У статті поки немає тексту.</p>
        )}

        {related.length > 0 && (
          <section className="mt-16 border-t border-[#E8E6DE] dark:border-white/10 pt-10">
            <div className="mb-4 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">// ЩЕ ПОЧИТАТИ</div>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/blog/${r.slug}`}
                    className="group block overflow-hidden rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] transition hover:border-[#FF6B00]/40"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
                      {r.cover_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={r.cover_url}
                          alt={r.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : null}
                    </div>
                    <div className="p-3">
                      <div className="line-clamp-2 text-sm font-medium leading-snug group-hover:text-[#993C1D] dark:group-hover:text-[#FF8A33]">
                        {r.title}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </PageShell>
  );
}
