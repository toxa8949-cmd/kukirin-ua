'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/app/admin/categories/actions';

type Initial = {
  id?: string;
  slug: string;
  name: string;
  description: string;
  image_url: string;
  sort_order: string;
};

const EMPTY: Initial = {
  slug: '',
  name: '',
  description: '',
  image_url: '',
  sort_order: '0',
};

export default function CategoryForm({
  mode,
  initial,
  initialMessage,
}: {
  mode: 'create' | 'edit';
  initial?: Initial;
  initialMessage?: string | null;
}) {
  const router = useRouter();
  const [form, setForm] = useState<Initial>(initial ?? EMPTY);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(initialMessage ?? null);

  function field<K extends keyof Initial>(k: K, v: Initial[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      if (mode === 'create') {
        const res = await createCategory(fd);
        if (!res.ok) setError(res.error);
      } else {
        const res = await updateCategory(fd);
        if (res.ok) setSuccess('Збережено.');
        else setError(res.error);
      }
    });
  }

  function handleDelete() {
    if (!form.id) return;
    if (!confirm(`Видалити категорію "${form.name}"?`)) return;
    startTransition(async () => {
      const res = await deleteCategory(form.id!);
      if (res.ok) router.push('/admin/categories');
      else setError(res.error);
    });
  }

  const inputCls =
    'w-full rounded-sm border border-white/15 bg-[#0A0A0A] px-3 py-2 text-sm outline-none transition focus:border-[#FF6B00]';
  const labelCls = 'block text-xs text-white/55 mb-1';
  const sectionCls = 'space-y-3 rounded-sm border border-white/10 bg-[#0F0F0F] p-5';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {form.id && <input type="hidden" name="id" value={form.id} />}

      {error && (
        <div className="flex items-start gap-2 rounded-sm border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-start gap-2 rounded-sm border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
          <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className={sectionCls}>
        <div className="text-[10px] tracking-[0.2em] text-[#FF8A33]">// ОСНОВНЕ</div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label>
            <span className={labelCls}>Назва*</span>
            <input
              name="name"
              required
              value={form.name}
              onChange={(e) => field('name', e.target.value)}
              className={inputCls}
              placeholder="Off-road самокати"
            />
          </label>
          <label>
            <span className={labelCls}>Slug* (латиниця, цифри, тире)</span>
            <input
              name="slug"
              required
              pattern="^[a-z0-9-]+$"
              value={form.slug}
              onChange={(e) => field('slug', e.target.value)}
              className={inputCls}
              placeholder="offroad"
            />
          </label>
        </div>
        <label className="block">
          <span className={labelCls}>Опис (показується на сторінці категорії)</span>
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={(e) => field('description', e.target.value)}
            className={`${inputCls} resize-y`}
            placeholder="Потужні мотори, м'яка підвіска і всюдихідні шини."
          />
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_120px]">
          <label className="block">
            <span className={labelCls}>URL зображення</span>
            <input
              name="image_url"
              value={form.image_url}
              onChange={(e) => field('image_url', e.target.value)}
              className={inputCls}
              placeholder="https://..."
            />
          </label>
          <label className="block">
            <span className={labelCls}>Порядок</span>
            <input
              name="sort_order"
              type="number"
              step="1"
              value={form.sort_order}
              onChange={(e) => field('sort_order', e.target.value)}
              className={inputCls}
            />
          </label>
        </div>
        {form.image_url && (
          <div className="inline-block overflow-hidden rounded-sm border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.image_url} alt="preview" className="h-24 w-32 object-cover" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-sm bg-[#FF6B00] px-6 py-3 text-xs font-medium tracking-[0.1em] text-black hover:bg-[#FF8A33] disabled:opacity-60"
        >
          {isPending ? 'ЗБЕРЕЖЕННЯ…' : mode === 'create' ? 'СТВОРИТИ' : 'ЗБЕРЕГТИ'}
        </button>

        {mode === 'edit' && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-sm border border-red-500/30 bg-red-500/5 px-4 py-3 text-xs text-red-300 hover:border-red-500/50 hover:bg-red-500/10 disabled:opacity-60"
          >
            <Trash2 size={14} /> Видалити
          </button>
        )}
      </div>
    </form>
  );
}
