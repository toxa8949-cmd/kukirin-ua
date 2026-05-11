# KUKIRIN.UA

Окремий e-commerce сайт офіційного дистриб'ютора електросамокатів KUKIRIN в Україні.

**Стек:** Next.js 16 (App Router) · React 19 · Tailwind v4 · TypeScript · Vercel

## 📁 Структура

```
kukirin-ua/
├── app/
│   ├── globals.css          ← Tailwind + усі анімації (гліч, треки, fade-up)
│   ├── layout.tsx           ← root layout + SEO metadata
│   └── page.tsx             ← головна сторінка (збирає всі секції)
├── components/
│   └── kukirin/
│       ├── KukirinHero.tsx       ← герой з гліч-заголовком FEEL THE RUSH
│       ├── KukirinModels.tsx     ← сітка 6 моделей з цінами і бейджами
│       ├── KukirinFeatures.tsx   ← 6 переваг (доставка, гарантія, …)
│       ├── KukirinCTA.tsx        ← форма зворотного дзвінка
│       └── KukirinFooter.tsx     ← футер
├── lib/
│   └── kukirin-data.ts      ← дані моделей (поки захардкожено)
├── public/                  ← сюди потім фото в /kukirin/g2-pro.webp і т.д.
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── next-env.d.ts
└── .gitignore
```

## 🚀 Як задеплоїти (без терміналу, через GitHub web UI)

### 1. Створити репозиторій на GitHub

1. Зайди на https://github.com/new
2. Назва: `kukirin-ua` (або як зручніше)
3. Public або Private — як хочеш
4. **НЕ** ставити галочки "Add a README", "Add .gitignore", "Choose a license"
5. Натиснути **Create repository**

### 2. Завантажити файли

1. На сторінці нового пустого репо натиснути **"uploading an existing file"**
2. Розпакувати ZIP на комп'ютері
3. Перетягнути **вміст папки `kukirin-ua/`** (не саму папку — а все, що всередині) у вікно завантаження GitHub
4. Унизу: commit message `Initial commit`
5. Натиснути **Commit changes**

### 3. Підключити Vercel

1. Зайти на https://vercel.com/new
2. Імпортувати створений репозиторій
3. Framework: Next.js — підставиться автоматично
4. Натиснути **Deploy** — нічого більше налаштовувати не треба

За ~2 хвилини сайт буде доступний на `kukirin-ua-xxxxx.vercel.app`.

### 4. Прив'язати домен `kukirin.ua` (коли купиш)

1. У Vercel: проєкт → Settings → Domains → Add → `kukirin.ua`
2. У реєстратора домена прописати DNS-записи, які покаже Vercel (зазвичай це A-запис на `76.76.21.21` і CNAME для `www`)
3. SSL Vercel випустить сам

## ✅ Що вже зроблено

- 🎨 **Hero** з гліч-анімацією `FEEL THE RUSH` (помаранчевий + блакитний RGB-зсув кожні 4 сек)
- 🎨 Миготливий курсор `_`, пульсуюча точка "В наявності", 4 анімовані треки швидкості фоном
- 🎨 Стаггер-поява блоків при завантаженні
- 🛴 **6 моделей** з цінами, бейджами ХІТ/NEW/TOP, hover-станами
- ✅ **6 переваг** сіткою
- 📞 **Форма зворотного дзвінка** → `POST /api/callback`
- 🦶 **Футер** з соц-мережами, навігацією, контактами
- 🔍 **SEO metadata** (title, description, OG, robots) і `lang="uk"`
- ♿ **prefers-reduced-motion** — для людей з обмеженнями анімації вимикаються
- 📱 **Адаптив** — mobile-first

## ⚙️ Що треба ще зробити

### 1. Фотографії моделей
Зараз SVG-плейсхолдер. Додай у `public/kukirin/`:
- `g2-pro.webp`
- `g2-master.webp`
- `g4-max.webp`
- `m4-pro.webp`
- `g3-pro.webp`
- `c1-pro.webp`

У `lib/kukirin-data.ts` у кожного скутера заповни поле `image: '/kukirin/g2-pro.webp'`.
У `KukirinModels.tsx` заміни SVG-плейсхолдер на `<Image src={scooter.image} alt={scooter.name} ... />` з `next/image`.

### 2. Supabase (як в Ausom)
Створи проєкт Supabase під KUKIRIN.UA, таблицю `kukirin_scooters` зі стовпцями з типу `KukirinScooter` (`lib/kukirin-data.ts`). Зроби серверну функцію, яка тягне з Supabase, передай у компонент:

```tsx
// app/page.tsx
const scooters = await getKukirinScooters();
<KukirinModels scooters={scooters} />
```

### 3. API роут для форми зворотного дзвінка
Створи `app/api/callback/route.ts`:
```ts
export async function POST(req: Request) {
  const data = await req.formData();
  const phone = data.get('phone');
  // 1) збереження в Supabase (таблиця callbacks)
  // 2) Telegram-нотифікація
  return Response.redirect(new URL('/?callback=ok', req.url), 303);
}
```

### 4. Сторінки товарів і категорій
Зараз посилання `/product/g2-pro` і `/category/urban` ведуть в нікуди (404). Треба зробити:
- `app/product/[slug]/page.tsx` — детальна сторінка моделі
- `app/category/[slug]/page.tsx` — фільтрована сторінка категорії
- `app/accessories/page.tsx`, `app/service/page.tsx`, `app/blog/page.tsx`, …

### 5. SEO + аналітика
- Article+Breadcrumb schema (як у Ausom)
- Google Analytics + Meta Pixel
- `sitemap.ts` і `robots.ts` у корені `app/`
- `favicon.ico` у корені `app/`

## 🎨 Кольори бренду

| Значення | Колір | Де використовується |
|---|---|---|
| `#0A0A0A` | основний фон | сайт |
| `#FF6B00` | акцентний помаранчевий | кнопки, бейджі, акценти |
| `#FF8A33` | світліший помаранчевий | системні теги, hover-стани |
| `#00D9FF` | блакитний | гліч-ефект (тільки RGB-зсув) |
| `#070707` | темніший фон | футер |

CSS-змінні в `app/globals.css`: `--kukirin-bg`, `--kukirin-orange`, `--kukirin-orange-light`, `--kukirin-cyan`.

## 💡 Якщо хочеш локально протестувати

Дві опції:
- StackBlitz: https://stackblitz.com/github/{твій-юзер}/kukirin-ua — відкриється в браузері без локального npm
- На комп'ютері: `npm install && npm run dev` → http://localhost:3000

Але це не обов'язково — Vercel показуватиме preview-білд на кожен commit.
