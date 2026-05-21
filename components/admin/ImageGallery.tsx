'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, Trash2, ImageIcon, Star } from 'lucide-react';
import { uploadProductImage } from '@/app/admin/products/actions';

interface ImageGalleryProps {
  images: string[]; // [coverUrl, ...gallery]
  onChange: (next: string[]) => void;
}

/**
 * Галерея фото з підтримкою:
 * - Multi-select через input[type=file multiple]
 * - Drag & drop файлів з робочого столу
 * - Drag & drop сортування існуючих фото
 * - Перше фото = головне (cover)
 * - Прогрес-бар під час завантаження
 */
export default function ImageGallery({ images, onChange }: ImageGalleryProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // === ЗАВАНТАЖЕННЯ ФАЙЛІВ ===

  async function uploadFiles(files: FileList | File[]) {
    const filesArr = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (filesArr.length === 0) {
      setError('Не вибрано жодного зображення');
      return;
    }

    setError(null);
    setUploading(true);
    setProgress({ current: 0, total: filesArr.length });

    const uploaded: string[] = [];
    for (let i = 0; i < filesArr.length; i++) {
      setProgress({ current: i + 1, total: filesArr.length });
      const fd = new FormData();
      fd.append('file', filesArr[i]);
      try {
        const res = await uploadProductImage(fd);
        if (res.ok && res.url) {
          uploaded.push(res.url);
        } else {
          setError(`Помилка для ${filesArr[i].name}: ${res.ok ? 'без URL' : res.error}`);
        }
      } catch (e) {
        setError(`Не вдалось завантажити ${filesArr[i].name}`);
      }
    }

    if (uploaded.length > 0) {
      onChange([...images, ...uploaded]);
    }
    setUploading(false);
    setProgress({ current: 0, total: 0 });
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    uploadFiles(files);
    // Скидаємо input щоб можна було вибрати ті ж файли знову
    e.target.value = '';
  }

  // === DRAG&DROP ФАЙЛІВ З РОБОЧОГО СТОЛУ ===

  function handleFileDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    // Тільки якщо тягнуть файли (а не фото у галереї)
    if (e.dataTransfer.types.includes('Files')) {
      setIsDraggingOver(true);
    }
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    // Перевіряємо чи покинули межі (бо drag-leave спрацьовує на дітях)
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDraggingOver(false);
  }

  // === DRAG&DROP СОРТУВАННЯ ФОТО ===

  function handleItemDragStart(e: DragEvent<HTMLDivElement>, index: number) {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Прозорий drag image щоб не бачили дублікат
    e.dataTransfer.setData('text/plain', String(index));
  }

  function handleItemDragOver(e: DragEvent<HTMLDivElement>, index: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIndex === null || draggedIndex === index) return;
    // Реалтайм reordering для smooth UX
    const newImages = [...images];
    const [moved] = newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, moved);
    onChange(newImages);
    setDraggedIndex(index);
  }

  function handleItemDragEnd() {
    setDraggedIndex(null);
  }

  // === ВИДАЛЕННЯ ===

  function handleRemove(index: number) {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  }

  return (
    <div className="space-y-3">
      {/* DROP ZONE */}
      <div
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-md border-2 border-dashed p-8 text-center transition ${
          isDraggingOver
            ? 'border-[#FF6B00] bg-[#FFF7F0] dark:bg-[#FF6B00]/5'
            : 'border-[#E8E6DE] bg-[#FAFAF7] hover:border-[#FF6B00]/50 hover:bg-[#FFF7F0] dark:border-white/15 dark:bg-[#0A0A0A] dark:hover:bg-white/[0.02]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleInputChange}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6B00]/10">
            <Upload size={20} className="text-[#FF6B00]" />
          </div>
          <div className="text-sm font-medium text-[#1a1a1a] dark:text-white">
            Перетягни фото сюди або клікни щоб вибрати
          </div>
          <div className="text-xs text-[#6C6A65] dark:text-white/45">
            Можна обирати декілька файлів одночасно (Cmd/Ctrl + клік)
          </div>
        </div>
      </div>

      {/* PROGRESS */}
      {uploading && (
        <div className="rounded-sm border border-[#E8E6DE] bg-white p-3 dark:border-white/10 dark:bg-[#0F0F0F]">
          <div className="mb-2 flex items-center justify-between text-xs text-[#4A4A48] dark:text-white/60">
            <span>Завантаження {progress.current} з {progress.total}…</span>
            <span>{Math.round((progress.current / progress.total) * 100)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#E8E6DE] dark:bg-white/10">
            <div
              className="h-full bg-[#FF6B00] transition-all"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="rounded-sm border border-[#FF6B00]/40 bg-[#FFF7F0] p-3 text-xs text-[#993C1D] dark:border-[#FF6B00]/30 dark:bg-[#FF6B00]/5 dark:text-[#FF8A33]">
          {error}
        </div>
      )}

      {/* GALLERY GRID */}
      {images.length > 0 && (
        <>
          <div className="flex items-center justify-between text-[10px] tracking-[0.2em] text-[#6C6A65] dark:text-white/40">
            <span>// {images.length} ФОТО · ПЕРЕТЯГНИ ДЛЯ СОРТУВАННЯ</span>
            <span>ПЕРШЕ = ГОЛОВНЕ</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {images.map((url, index) => (
              <div
                key={`${url}-${index}`}
                draggable
                onDragStart={(e) => handleItemDragStart(e, index)}
                onDragOver={(e) => handleItemDragOver(e, index)}
                onDragEnd={handleItemDragEnd}
                className={`group relative aspect-square cursor-move overflow-hidden rounded-md border-2 transition ${
                  index === 0
                    ? 'border-[#FF6B00] shadow-md'
                    : 'border-[#E8E6DE] dark:border-white/15'
                } ${draggedIndex === index ? 'opacity-40' : ''} bg-white dark:bg-[#0F0F0F]`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Фото ${index + 1}`}
                  className="h-full w-full object-contain p-1"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.opacity = '0.3';
                  }}
                />

                {/* Бейдж "головне" */}
                {index === 0 && (
                  <span className="absolute left-1 top-1 inline-flex items-center gap-1 rounded-sm bg-[#FF6B00] px-1.5 py-0.5 text-[9px] font-medium tracking-wider text-white dark:text-black">
                    <Star size={9} fill="currentColor" /> ГОЛОВНЕ
                  </span>
                )}

                {/* Номер позиції */}
                {index > 0 && (
                  <span className="absolute left-1 top-1 rounded-sm bg-white/90 px-1.5 py-0.5 text-[9px] font-medium tracking-wider text-[#4A4A48] backdrop-blur dark:bg-black/80 dark:text-white/70">
                    {index + 1}
                  </span>
                )}

                {/* Кнопка видалити */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-sm bg-white/90 text-[#4A4A48] opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 dark:bg-black/80 dark:text-white/70 dark:hover:bg-red-950 dark:hover:text-red-400"
                  title="Видалити"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* EMPTY STATE */}
      {images.length === 0 && !uploading && (
        <div className="rounded-sm border border-[#E8E6DE] bg-white p-6 text-center dark:border-white/10 dark:bg-[#0F0F0F]">
          <ImageIcon size={28} className="mx-auto mb-2 text-[#E8E6DE] dark:text-white/15" />
          <div className="text-xs text-[#6C6A65] dark:text-white/40">
            Ще немає жодного фото
          </div>
        </div>
      )}
    </div>
  );
}
