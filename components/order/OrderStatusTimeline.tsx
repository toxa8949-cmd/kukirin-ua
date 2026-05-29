import { Check, Clock, PackageCheck, Truck, Star, XCircle } from 'lucide-react';

const STEPS = [
  { key: 'new',       label: 'Нове',          desc: 'Очікує підтвердження менеджером', icon: Clock },
  { key: 'confirmed', label: 'Підтверджене',  desc: 'Готується до відправки',          icon: PackageCheck },
  { key: 'shipped',   label: 'Відправлене',   desc: 'У дорозі Новою Поштою',           icon: Truck },
  { key: 'completed', label: 'Завершене',     desc: 'Доставлено й оплачено',           icon: Star },
] as const;

/**
 * Візуальний таймлайн статусів замовлення.
 * Підсвічуються пройдені + поточний крок. canceled — окремий стан.
 */
export default function OrderStatusTimeline({ status }: { status: string }) {
  if (status === 'canceled') {
    return (
      <div className="rounded-sm border border-[#D43838] bg-[#FFF5F5] p-5 dark:bg-[#1A0808]">
        <div className="flex items-start gap-3">
          <XCircle size={20} className="mt-0.5 flex-shrink-0 text-[#D43838]" />
          <div>
            <div className="text-sm font-medium text-[#9A1F1F] dark:text-[#FF8888]">
              Замовлення скасоване
            </div>
            <p className="mt-1 text-xs text-[#6C6A65] dark:text-white/55">
              Якщо це сталося помилково — зателефонуйте 0 (95) 898-10-07.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === status);
  const idx = currentIndex < 0 ? 0 : currentIndex;

  return (
    <ol className="relative">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const isDone = i < idx;
        const isCurrent = i === idx;
        const isFuture = i > idx;

        return (
          <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Лінія між кроками */}
            {i < STEPS.length - 1 && (
              <div
                aria-hidden
                className={`absolute left-[19px] top-10 bottom-0 w-px ${
                  isDone || isCurrent ? 'bg-[#FF6B00]' : 'bg-[#E8E6DE] dark:bg-white/15'
                }`}
              />
            )}

            <div
              className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                isDone
                  ? 'bg-[#FF6B00] text-white dark:text-black'
                  : isCurrent
                  ? 'border-2 border-[#FF6B00] bg-white text-[#FF6B00] dark:bg-[#0A0A0A]'
                  : 'border border-[#E8E6DE] bg-white text-[#6C6A65] dark:border-white/15 dark:bg-[#0A0A0A] dark:text-white/30'
              }`}
            >
              {isDone ? <Check size={16} /> : <Icon size={16} />}
            </div>

            <div className="flex-1 pt-1">
              <div
                className={`text-sm font-medium ${
                  isFuture ? 'text-[#6C6A65] dark:text-white/35' : 'text-[#1a1a1a] dark:text-white'
                }`}
              >
                {step.label}
                {isCurrent && (
                  <span className="ml-2 inline-block rounded-sm bg-[#FF6B00]/10 px-2 py-0.5 text-[10px] tracking-[0.1em] text-[#FF6B00]">
                    ЗАРАЗ
                  </span>
                )}
              </div>
              <div className={`mt-1 text-xs ${isFuture ? 'text-[#6C6A65]/70 dark:text-white/25' : 'text-[#6C6A65] dark:text-white/45'}`}>
                {step.desc}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
