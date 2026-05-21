'use client';

import { useState, useTransition } from 'react';
import { AlertCircle, CheckCircle2, Save, MessageSquarePlus } from 'lucide-react';
import {
  updateOrderStatus,
  appendOrderNote,
} from '@/app/admin/orders/actions';
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABEL,
} from '@/app/admin/orders/constants';

export default function OrderActions({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleStatusSave() {
    setError(null);
    setSuccess(null);
    const fd = new FormData();
    fd.append('id', id);
    fd.append('status', status);
    startTransition(async () => {
      const res = await updateOrderStatus(fd);
      if (res.ok) setSuccess('Статус оновлено.');
      else setError(res.error);
    });
  }

  function handleAddNote() {
    setError(null);
    setSuccess(null);
    if (!note.trim()) return;
    const fd = new FormData();
    fd.append('id', id);
    fd.append('note', note);
    startTransition(async () => {
      const res = await appendOrderNote(fd);
      if (res.ok) {
        setNote('');
        setSuccess('Нотатку додано.');
      } else {
        setError(res.error);
      }
    });
  }

  const inputCls =
    'w-full rounded-sm border border-[#E8E6DE] dark:border-white/15 bg-[#FAFAF7] dark:bg-[#0A0A0A] px-3 py-2 text-sm outline-none transition focus:border-[#FF6B00]';

  return (
    <div className="space-y-4 rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-5">
      <div className="text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">// ДІЇ</div>

      {error && (
        <div className="flex items-start gap-2 rounded-sm border border-red-500/30 bg-red-500/10 p-2 text-xs text-red-300">
          <AlertCircle size={12} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-start gap-2 rounded-sm border border-emerald-500/30 bg-emerald-500/10 p-2 text-xs text-emerald-300">
          <CheckCircle2 size={12} className="mt-0.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-xs text-[#4A4A48] dark:text-white/55">Статус</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={inputCls}
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABEL[s]} · {s}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleStatusSave}
          disabled={isPending || status === currentStatus}
          className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[#FF6B00] px-4 py-2.5 text-xs font-medium tracking-[0.1em] text-white dark:text-black hover:bg-[#FF8A33] disabled:opacity-40"
        >
          <Save size={12} /> {isPending ? 'ЗБЕРЕЖЕННЯ…' : 'ЗБЕРЕГТИ СТАТУС'}
        </button>
      </div>

      <div className="space-y-2 border-t border-[#E8E6DE] dark:border-white/10 pt-4">
        <label className="block text-xs text-[#4A4A48] dark:text-white/55">Додати нотатку (в історію)</label>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Передзвонив, клієнт підтвердив адресу"
          className={`${inputCls} resize-y`}
        />
        <button
          type="button"
          onClick={handleAddNote}
          disabled={isPending || !note.trim()}
          className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-[#E8E6DE] dark:border-white/15 px-4 py-2 text-xs hover:border-[#DCDAD0] dark:hover:border-white/40 disabled:opacity-40"
        >
          <MessageSquarePlus size={12} /> Додати нотатку
        </button>
      </div>
    </div>
  );
}
