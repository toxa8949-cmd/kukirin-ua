// Дані моделей Kukirin
// Ціни орієнтовні — оновити з адмінки/Supabase після інтеграції

export type KukirinScooter = {
  slug: string;
  name: string;
  category: 'urban' | 'offroad' | 'flagship';
  badge?: 'hit' | 'new' | 'top';
  power: number; // Вт
  maxSpeed: number; // км/год
  range: number; // км
  battery: string;
  price: number; // грн
  oldPrice?: number;
  image?: string; // шлях до фото в /public/kukirin/
  tagline: string;
};

export const KUKIRIN_SCOOTERS: KukirinScooter[] = [
  {
    slug: 'g2-pro',
    name: 'KUKIRIN G2 Pro',
    category: 'offroad',
    badge: 'hit',
    power: 800,
    maxSpeed: 45,
    range: 40,
    battery: '48V 15Ah',
    price: 24999,
    oldPrice: 29999,
    tagline: 'Off-road beast',
  },
  {
    slug: 'g2-master',
    name: 'KUKIRIN G2 Master',
    category: 'flagship',
    badge: 'top',
    power: 2000,
    maxSpeed: 70,
    range: 80,
    battery: '60V 20Ah',
    price: 54999,
    tagline: 'Dual motor flagship',
  },
  {
    slug: 'g4-max',
    name: 'KUKIRIN G4 Max',
    category: 'flagship',
    badge: 'new',
    power: 2000,
    maxSpeed: 70,
    range: 80,
    battery: '60V 20Ah',
    price: 48999,
    tagline: 'Power & range',
  },
  {
    slug: 'm4-pro',
    name: 'KUKIRIN M4 Pro',
    category: 'urban',
    power: 600,
    maxSpeed: 45,
    range: 45,
    battery: '48V 13Ah',
    price: 18499,
    tagline: 'Daily urban',
  },
  {
    slug: 'g3-pro',
    name: 'KUKIRIN G3 Pro',
    category: 'flagship',
    power: 2400,
    maxSpeed: 65,
    range: 70,
    battery: '52V 23Ah',
    price: 42999,
    tagline: 'Speed & comfort',
  },
  {
    slug: 'c1-pro',
    name: 'KUKIRIN C1 Pro',
    category: 'urban',
    power: 500,
    maxSpeed: 35,
    range: 60,
    battery: '48V 26Ah',
    price: 21999,
    tagline: 'Long range commuter',
  },
];

// Геро-модель для головного блоку
export const HERO_SCOOTER = KUKIRIN_SCOOTERS.find((s) => s.slug === 'g2-pro')!;

// Топ-статистика для геро-секції
export const HERO_STATS = [
  { value: '70', unit: 'km/h', label: 'МАКС. ШВИДКІСТЬ' },
  { value: '2000', unit: 'W', label: 'DUAL MOTOR' },
  { value: '60', unit: 'km', label: 'ЗАПАС ХОДУ' },
  { value: '3.8', unit: 's', label: '0–30 КМ/ГОД' },
];
