'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/app/admin/products/actions';
import ImageGallery from '@/components/admin/ImageGallery';

type Category = { id: string; name: string; slug: string };

type Initial = {
  id?: string;
  slug: string;
  name: string;
  description: string;
  price: string;
  old_price: string;
  category_id: string;
  stock: string;
  is_active: boolean;
  featured: boolean;
  cover_url: string;
  specs_category: string;
  specs_badge: string;
  specs_tagline: string;
  specs_power: string;
  specs_max_speed: string;
  specs_range: string;
  specs_battery: string;
  image_urls: string;
};

const EMPTY: Initial = {
  slug: '',
  name: '',
  description: '',
  price: '',
  old_price: '',
  category_id: '',
  stock: '0',
  is_active: true,
  featured: false,
  cover_url: '',
  specs_category: 'urban',
  specs_badge: '',
  specs_tagline: '',
  specs_power: '',
  specs_max_speed: '',
  specs_range: '',
  specs_battery: '',
  image_urls: '',
};

export default function ProductForm({
  mode,
  initial,
  categories,
  initialMessage,
}: {
  mode: 'create' | 'edit';
  initial?: Initial;
  categories: Category[];
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

  // Об'єднуємо cover + gallery в один масив для ImageGallery
  // Перший елемент завжди = cover, решта = gallery
  const allImages: string[] = [
    ...(form.cover_url ? [form.cover_url] : []),
    ...form.image_urls.split('\n').map((u) => u.trim()).filter(Boolean),
  ];

  function handleImagesChange(next: string[]) {
    if (next.length === 0) {
      setForm((f) => ({ ...f, cover_url: '', image_urls: '' }));
    } else {
      setForm((f) => ({
        ...f,
        cover_url: next[0],
        image_urls: next.slice(1).join('\n'),
      }));
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      if (mode === 'create') {
        const res = await createProduct(fd);
        if (!res.ok) setError(res.error);
        // on ok, server action redirects
      } else {
        const res = await updateProduct(fd);
        if (res.ok) setSuccess('Збережено.');
        else setError(res.error);
      }
    });
  }

  function handleDelete() {
    if (!form.id) return;
    if (!confirm(`Видалити "${form.name}"? Це не можна відмінити.`)) return;
    startTransition(async () => {
      const res = await deleteProduct(form.id!);
      if (res.ok) router.push('/admin/products');
      else setError(res.error);
    });
  }

  const inputCls =
    'w-full rounded-sm border border-[#E8E6DE] dark:border-white/15 bg-[#FAFAF7] dark:bg-[#0A0A0A] px-3 py-2 text-sm outline-none transition focus:border-[#FF6B00]';
  const labelCls = 'block text-xs text-[#4A4A48] dark:text-white/55 mb-1';
  const sectionCls = 'space-y-3 rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-5';

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
        <div className="text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">// ОСНОВНЕ</div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label>
            <span className={labelCls}>Назва*</span>
            <input
              name="name"
              required
              value={form.name}
              onChange={(e) => field('name', e.target.value)}
              className={inputCls}
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
              placeholder="kukirin-g3-pro"
            />
          </label>
        </div>
        <label className="block">
          <span className={labelCls}>Опис</span>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={(e) => field('description', e.target.value)}
            className={`${inputCls} resize-y`}
          />
        </label>
        <label className="block">
          <span className={labelCls}>Категорія</span>
          <select
            name="category_id"
            value={form.category_id}
            onChange={(e) => field('category_id', e.target.value)}
            className={inputCls}
          >
            <option value="">— без категорії —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} (/{c.slug})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={sectionCls}>
        <div className="text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">// ЦІНА І СКЛАД</div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label>
            <span className={labelCls}>Ціна (₴)*</span>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              value={form.price}
              onChange={(e) => field('price', e.target.value)}
              className={inputCls}
            />
          </label>
          <label>
            <span className={labelCls}>Стара ціна (₴)</span>
            <input
              name="old_price"
              type="number"
              step="0.01"
              min="0"
              value={form.old_price}
              onChange={(e) => field('old_price', e.target.value)}
              className={inputCls}
            />
          </label>
          <label>
            <span className={labelCls}>На складі</span>
            <input
              name="stock"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={(e) => field('stock', e.target.value)}
              className={inputCls}
            />
          </label>
        </div>
        <div className="flex gap-6 pt-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={(e) => field('is_active', e.target.checked)}
              className="h-4 w-4 accent-[#FF6B00]"
            />
            Активний (показувати в каталозі)
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={(e) => field('featured', e.target.checked)}
              className="h-4 w-4 accent-[#FF6B00]"
            />
            Рекомендований (показувати на головній)
          </label>
        </div>
      </div>

      <div className={sectionCls}>
        <div className="text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">// ХАРАКТЕРИСТИКИ</div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label>
            <span className={labelCls}>Категорія (специфікація)</span>
            <select
              name="specs_category"
              value={form.specs_category}
              onChange={(e) => field('specs_category', e.target.value)}
              className={inputCls}
            >
              <option value="urban">urban — місто</option>
              <option value="offroad">offroad</option>
              <option value="flagship">flagship</option>
              <option value="accessory">accessory</option>
            </select>
          </label>
          <label>
            <span className={labelCls}>Бейдж</span>
            <select
              name="specs_badge"
              value={form.specs_badge}
              onChange={(e) => field('specs_badge', e.target.value)}
              className={inputCls}
            >
              <option value="">— без бейджа —</option>
              <option value="hit">hit — ХІТ</option>
              <option value="new">new — NEW</option>
              <option value="top">top — TOP</option>
            </select>
          </label>
          <label>
            <span className={labelCls}>Tagline (короткий опис на картці)</span>
            <input
              name="specs_tagline"
              value={form.specs_tagline}
              onChange={(e) => field('specs_tagline', e.target.value)}
              className={inputCls}
              placeholder="Потужний міський з подвійною підвіскою"
            />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <label>
            <span className={labelCls}>Мотор</span>
            <input
              name="specs_power"
              value={form.specs_power}
              onChange={(e) => field('specs_power', e.target.value)}
              className={inputCls}
              placeholder="600W або 2x1200W"
            />
          </label>
          <label>
            <span className={labelCls}>Макс. швидкість</span>
            <input
              name="specs_max_speed"
              value={form.specs_max_speed}
              onChange={(e) => field('specs_max_speed', e.target.value)}
              className={inputCls}
              placeholder="45"
            />
          </label>
          <label>
            <span className={labelCls}>Запас ходу</span>
            <input
              name="specs_range"
              value={form.specs_range}
              onChange={(e) => field('specs_range', e.target.value)}
              className={inputCls}
              placeholder="55 km"
            />
          </label>
          <label>
            <span className={labelCls}>Батарея</span>
            <input
              name="specs_battery"
              value={form.specs_battery}
              onChange={(e) => field('specs_battery', e.target.value)}
              className={inputCls}
              placeholder="48V 15Ah"
            />
          </label>
        </div>
      </div>

      <div className={sectionCls}>
        <div className="text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">// ФОТО</div>

        {/* Приховані поля для FormData submit — підставляються з allImages автоматично */}
        <input type="hidden" name="cover_url" value={form.cover_url} />
        <input type="hidden" name="image_urls" value={form.image_urls} />

        <ImageGallery images={allImages} onChange={handleImagesChange} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-sm bg-[#FF6B00] px-6 py-3 text-xs font-medium tracking-[0.1em] text-white dark:text-black hover:bg-[#FF8A33] disabled:opacity-60"
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
