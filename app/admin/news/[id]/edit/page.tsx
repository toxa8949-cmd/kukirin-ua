import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import NewsForm from '@/components/admin/NewsForm';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Редагування статті' };

type NewsRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_url: string | null;
  published: boolean | null;
};

export default async function EditNewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { id } = await params;
  const { created } = await searchParams;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('news')
    .select('id, slug, title, excerpt, content, cover_url, published')
    .eq('id', id)
    .maybeSingle();

  if (error) console.error('EditNewsPage:', error);
  if (!data) notFound();
  const n = data as unknown as NewsRow;

  const initial = {
    id: n.id,
    slug: n.slug,
    title: n.title,
    excerpt: n.excerpt ?? '',
    content: n.content ?? '',
    cover_url: n.cover_url ?? '',
    published: !!n.published,
  };

  const message = created === '1' ? 'Статтю створено.' : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href="/admin/news" className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-white">
            <ArrowLeft size={12} /> До списку
          </Link>
          <div className="mt-2 mb-1 text-[10px] tracking-[0.2em] text-[#FF8A33]">// NEWS · EDIT</div>
          <h1 className="text-3xl font-medium tracking-tight">{n.title}</h1>
        </div>
        {n.published && (
          <Link
            href={`/blog/${n.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-[#FF6B00]"
          >
            Подивитись на сайті <ExternalLink size={12} />
          </Link>
        )}
      </div>

      <NewsForm mode="edit" initial={initial} initialMessage={message} />
    </div>
  );
}
