'use client';
import { useState, useTransition } from 'react';
import { Star } from 'lucide-react';
import ReviewStars from './ReviewStars';
import { submitReview, type ReviewSubmitResult } from '@/app/product/[slug]/actions';
import type { ProductReview } from '@/lib/data/reviews';

export default function ProductReviews({
  productId,
  productSlug,
  productName,
  initialReviews,
  aggregate,
}: {
  productId: string;
  productSlug: string;
  productName: string;
  initialReviews: ProductReview[];
  aggregate: { ratingValue: number; ratingCount: number } | null;
}) {
  const [showForm, setShowForm] = useState(initialReviews.length === 0);
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    formData.set('rating', String(rating));
    formData.set('product_id', productId);
    formData.set('slug', productSlug);
    startTransition(async () => {
      const res: ReviewSubmitResult = await submitReview(formData);
      if (res.ok) {
        setSubmitted(true);
        setShowForm(false);
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <section className="mt-16 border-t border-[#E8E6DE] dark:border-white/10 pt-10">
      <div className="mb-2 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">
        // ВІДГУКИ ПОКУПЦІВ
      </div>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
            Відгуки про {productName}
          </h2>
          {aggregate ? (
            <div className="mt-2 flex items-center gap-3">
              <ReviewStars value={aggregate.ratingValue} size={18} />
              <span className="text-sm">
                <span className="font-medium">{aggregate.ratingValue.toFixed(1)}</span>
                <span className="text-[#6C6A65] dark:text-white/45">
                  {' '}/ 5 — на основі {aggregate.ratingCount}{' '}
                  {aggregate.ratingCount === 1 ? 'відгуку' : 'відгуків'}
                </span>
              </span>
            </div>
          ) : (
            <p className="mt-2 text-sm text-[#6C6A65] dark:text-white/55">
              Поки що відгуків немає. Будьте першим, хто залишить!
            </p>
          )}
        </div>
        {!showForm && !submitted && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-sm bg-[#FF6B00] px-4 py-2.5 text-xs font-medium tracking-[0.1em] text-white transition hover:bg-[#FF8A33] dark:text-black"
          >
            ЗАЛИШИТИ ВІДГУК
          </button>
        )}
      </div>

      {submitted && (
        <div className="mb-6 rounded-sm border border-[#22A55F] bg-[#F0FAF3] p-4 text-sm text-[#1a6e3d]">
          ✓ Дякуємо! Ваш відгук надіслано на модерацію — після перевірки він з'явиться на сторінці.
        </div>
      )}

      {showForm && !submitted && (
        <form
          action={handleSubmit}
          className="mb-8 rounded-sm border border-[#E8E6DE] bg-[#FAFAF7] p-5 dark:border-white/10 dark:bg-[#0F0F0F]"
        >
          {/* Honeypot */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="absolute -left-[9999px] h-0 w-0"
            aria-hidden="true"
          />

          <div className="mb-4">
            <label className="mb-2 block text-xs font-medium tracking-[0.1em] text-[#4A4A48] dark:text-white/70">
              ОЦІНКА *
            </label>
            <div
              className="inline-flex gap-1"
              onMouseLeave={() => setHoverRating(0)}
            >
              {[1, 2, 3, 4, 5].map((i) => {
                const active = (hoverRating || rating) >= i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i)}
                    onMouseEnter={() => setHoverRating(i)}
                    aria-label={`${i} з 5`}
                    className="cursor-pointer transition"
                  >
                    <Star
                      size={28}
                      className={active ? 'fill-[#FF6B00] text-[#FF6B00]' : 'text-[#E8E6DE] dark:text-white/20'}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="rev-name" className="mb-2 block text-xs font-medium tracking-[0.1em] text-[#4A4A48] dark:text-white/70">
              ВАШЕ ІМ'Я *
            </label>
            <input
              id="rev-name"
              name="name"
              type="text"
              required
              maxLength={80}
              placeholder="Іван П."
              className="w-full rounded-sm border border-[#E8E6DE] bg-white px-3 py-2 text-sm placeholder:text-[#6C6A65] focus:border-[#FF6B00] focus:outline-none dark:border-white/15 dark:bg-[#0A0A0A] dark:placeholder:text-white/30"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="rev-text" className="mb-2 block text-xs font-medium tracking-[0.1em] text-[#4A4A48] dark:text-white/70">
              ВАШ ВІДГУК *
            </label>
            <textarea
              id="rev-text"
              name="text"
              required
              minLength={5}
              maxLength={2000}
              rows={5}
              placeholder="Що сподобалось, як їздить, що варто знати наступним покупцям..."
              className="w-full rounded-sm border border-[#E8E6DE] bg-white px-3 py-2 text-sm placeholder:text-[#6C6A65] focus:border-[#FF6B00] focus:outline-none dark:border-white/15 dark:bg-[#0A0A0A] dark:placeholder:text-white/30"
            />
          </div>

          {error && (
            <div className="mb-4 rounded-sm border border-[#D43838] bg-[#FFF5F5] p-3 text-sm text-[#9A1F1F]">
              {error}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-sm bg-[#FF6B00] px-5 py-2.5 text-xs font-medium tracking-[0.1em] text-white transition hover:bg-[#FF8A33] disabled:opacity-50 dark:text-black"
            >
              {isPending ? 'НАДСИЛАЄМО...' : 'НАДІСЛАТИ ВІДГУК'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-xs text-[#4A4A48] hover:text-[#1a1a1a] dark:text-white/55 dark:hover:text-white"
            >
              Скасувати
            </button>
            <span className="text-[10px] text-[#6C6A65] dark:text-white/40">
              Відгук пройде модерацію перед публікацією.
            </span>
          </div>
        </form>
      )}

      {initialReviews.length > 0 && (
        <ul className="space-y-5">
          {initialReviews.map((r) => (
            <li
              key={r.id}
              className="rounded-sm border border-[#E8E6DE] bg-white p-5 dark:border-white/10 dark:bg-[#0F0F0F]"
            >
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <ReviewStars value={r.rating} size={14} />
                <span className="text-sm font-medium">{r.name}</span>
                {r.published_at && (
                  <span className="text-[11px] text-[#6C6A65] dark:text-white/40">
                    {new Date(r.published_at).toLocaleDateString('uk-UA', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed text-[#4A4A48] dark:text-white/70">{r.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
