import { Star } from 'lucide-react';

/**
 * Зірочки рейтингу. Розмір налаштовується через size.
 * Якщо interactive — рендериться як кнопки (для форми введення).
 */
export default function ReviewStars({
  value,
  size = 16,
  className = '',
}: {
  value: number; // 1..5, може бути дробовим (4.3)
  size?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${value} з 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = value >= i;
        const half = !filled && value >= i - 0.5;
        return (
          <Star
            key={i}
            size={size}
            className={
              filled ? 'fill-[#FF6B00] text-[#FF6B00]'
              : half  ? 'fill-[#FF6B00]/50 text-[#FF6B00]'
              : 'text-[#E8E6DE] dark:text-white/20'
            }
          />
        );
      })}
    </span>
  );
}
