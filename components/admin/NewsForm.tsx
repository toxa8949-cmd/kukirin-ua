'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import {
  createNews,
  updateNews,
  deleteNews,
} from '@/app/admin/news/actions';

type Initial = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_url: string;
  published: boolean;
};

const EMPTY: Initial = {
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  cover_url: '',
  published: false,
};

export default function NewsForm({
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
        const res = await createNews(fd);
        if (!res.ok) setError(res.error);
      } else {
        const res = await updateNews(fd);
        if (res.ok) setSuccess('Збережено.');
        else setError(res.error);
      }
    });
  }

  function handleDelete() {
    if (!form.id) return;
    if (!confirm(`Видалити статтю "${form.title}"?`)) return;
    startTransition(async () => {
      const res = await deleteNews(form.id!);
      if (res.ok) router.push('/admin/news');
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
        <label className="block">
          <span className={labelCls}>Заголовок*</span>
          <input
            name="title"
            required
            value={form.title}
            onChange={(e) => field('title', e.target.value)}
            className={inputCls}
            placeholder="KUKIRIN G2 Pro проти G2 Master: що обрати"
          />
        </label>
        <label className="block">
          <span className={labelCls}>Slug* (латиниця, цифри, тире)</span>
          <input
            name="slug"
            required
            pattern="^[a-z0-9-]+$"
            value={form.slug}
            onChange={(e) => field('slug', e.target.value)}
            className={inputCls}
            placeholder="g2-pro-vs-g2-master"
          />
        </label>
        <label className="block">
          <span className={labelCls}>Анонс (короткий опис на картці блога)</span>
          <textarea
            name="excerpt"
            rows={2}
            value={form.excerpt}
            onChange={(e) => field('excerpt', e.target.value)}
            className={`${inputCls} resize-y`}
            placeholder="Коротко про що стаття…"
          />
        </label>
      </div>

      <div className={sectionCls}>
        <div className="text-[10px] tracking-[0.2em] text-[#FF8A33]">// КОНТЕНТ (Markdown)</div>
        <textarea
          name="content"
          rows={16}
          value={form.content}
          onChange={(e) => field('content', e.target.value)}
          className={`${inputCls} resize-y font-mono text-xs`}
          placeholder={'# Заголовок\n\nПерший абзац статті…\n\n## Підрозділ\n\n- список\n- елементів'}
        />
        <p className="text-[11px] text-white/40">
          Markdown: `# заголовок`, `**жирний**`, `*курсив*`, `- список`, `[посилання](url)`, `![alt](image_url)`.
        </p>
      </div>

      <div className={sectionCls}>
        <div className="text-[10px] tracking-[0.2em] text-[#FF8A33]">// ОФОРМЛЕННЯ</div>
        <label className="block">
          <span className={labelCls}>Cover URL (обкладинка статті)</span>
          <input
            name="cover_url"
            value={form.cover_url}
            onChange={(e) => field('cover_url', e.target.value)}
            className={inputCls}
            placeholder="https://..."
          />
        </label>
        {form.cover_url && (
          <div className="inline-block overflow-hidden rounded-sm border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.cover_url} alt="cover preview" className="h-32 w-56 object-cover" />
          </div>
        )}
        <div className="pt-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="published"
              checked={form.published}
              onChange={(e) => field('published', e.target.checked)}
              className="h-4 w-4 accent-[#FF6B00]"
            />
            Опублікувати (видно на сайті)
          </label>
          <p className="mt-1 ml-6 text-[11px] text-white/40">
            Збереження як чернетка не показує статтю на /blog.
            Дата публікації проставляється автоматично при першій публікації.
          </p>
        </div>
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
