import Link from 'next/link';
import { ArrowLeft, Check, EyeOff, Trash2, Star } from 'lucide-react';
import { getAllReviewsForAdmin } from '@/lib/data/reviews';
import { approveReview, unpublishReview, deleteReview } from './actions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Відгуки' };

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const f = filter === 'pending' || filter === 'published' ? filter : 'all';
  const list = await getAllReviewsForAdmin(f);
  const pendingCount = (await getAllReviewsForAdmin('pending')).length;

  const FilterTab = ({
    href,
    label,
    count,
    active,
  }: {
    href: string;
    label: string;
    count?: number;
    active: boolean;
  }) => (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs ${
        active
          ? 'bg-[#FF6B00] text-white dark:text-black'
          : 'border border-[#E8E6DE] text-[#4A4A48] hover:border-[#DCDAD0] dark:border-white/15 dark:text-white/70 dark:hover:border-white/30'
      }`}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span className={`rounded-sm px-1.5 ${active ? 'bg-black/15' : 'bg-[#FF6B00]/10 text-[#FF6B00]'}`}>
          {count}
        </span>
      )}
    </Link>
  );

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-[#4A4A48] dark:text-white/60 hover:text-[#1a1a1a]">
          <ArrowLeft size={12} /> На дашборд
        </Link>
        <div className="mt-2 mb-1 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">// REVIEWS</div>
        <h1 className="text-3xl font-medium tracking-tight">Відгуки</h1>
        <p className="mt-2 text-sm text-[#4A4A48] dark:text-white/55">
          {list.length} {f === 'pending' ? 'на модерації' : f === 'published' ? 'опублікованих' : 'усього'}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterTab href="/admin/reviews" label="Усі" active={f === 'all'} />
        <FilterTab href="/admin/reviews?filter=pending" label="На модерації" count={pendingCount} active={f === 'pending'} />
        <FilterTab href="/admin/reviews?filter=published" label="Опубліковані" active={f === 'published'} />
      </div>

      {list.length === 0 ? (
        <div className="rounded-sm border border-dashed border-[#E8E6DE] p-12 text-center text-sm text-[#6C6A65] dark:border-white/15 dark:text-white/55">
          {f === 'pending' ? 'Нових відгуків на модерації немає.' : 'Відгуків поки що немає.'}
        </div>
      ) : (
        <ul className="space-y-4">
          {list.map((r) => (
            <li
              key={r.id}
              className="rounded-sm border border-[#E8E6DE] bg-white p-5 dark:border-white/10 dark:bg-[#0F0F0F]"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={14}
                        className={r.rating >= i ? 'fill-[#FF6B00] text-[#FF6B00]' : 'text-[#E8E6DE] dark:text-white/20'}
                      />
                    ))}
                  </span>
                  <span className="text-sm font-medium">{r.name}</span>
                  {r.product_name && r.product_slug && (
                    <Link
                      href={`/product/${r.product_slug}`}
                      target="_blank"
                      className="text-xs text-[#4A4A48] underline-offset-4 hover:underline dark:text-white/55"
                    >
                      → {r.product_name}
                    </Link>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-sm px-2 py-0.5 text-[10px] font-medium tracking-[0.1em] ${
                      r.is_published
                        ? 'bg-[#F0FAF3] text-[#1a6e3d]'
                        : 'bg-[#FFF6E5] text-[#9A6300]'
                    }`}
                  >
                    {r.is_published ? 'ОПУБЛІКОВАНО' : 'НА МОДЕРАЦІЇ'}
                  </span>
                  <span className="text-[11px] text-[#6C6A65] dark:text-white/40">
                    {new Date(r.created_at).toLocaleDateString('uk-UA', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <p className="mb-4 text-sm leading-relaxed text-[#4A4A48] dark:text-white/70">{r.text}</p>

              <div className="flex flex-wrap gap-2">
                {!r.is_published ? (
                  <form action={approveReview.bind(null, r.id)}>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-sm bg-[#22A55F] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1c8c50]"
                    >
                      <Check size={12} /> ОПУБЛІКУВАТИ
                    </button>
                  </form>
                ) : (
                  <form action={unpublishReview.bind(null, r.id)}>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-sm border border-[#E8E6DE] px-3 py-1.5 text-xs text-[#4A4A48] hover:border-[#DCDAD0] dark:border-white/15 dark:text-white/70 dark:hover:border-white/30"
                    >
                      <EyeOff size={12} /> ПРИХОВАТИ
                    </button>
                  </form>
                )}
                <form action={deleteReview.bind(null, r.id)}>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-sm border border-[#D43838] px-3 py-1.5 text-xs text-[#D43838] hover:bg-[#FFF5F5]"
                  >
                    <Trash2 size={12} /> ВИДАЛИТИ
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
