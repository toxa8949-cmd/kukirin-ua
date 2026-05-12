# Block 12 — Site Settings + Dynamic Header/Footer

## Що в цьому пакеті

Це фінальний блок. Все що ти хотів змінювати руками — телефон, email, адреса,
соцмережі, копірайт — тепер живе в БД у таблиці `site_settings` і
редагується в адмінці. Хедер і футер на сайті беруть значення з БД.

### Файли (заливаються в репо)

```
sql/site-settings.sql              — нова таблиця + RLS + seed дефолтних ключів
lib/site-settings.ts               — server util getSiteSettings()
app/admin/settings/page.tsx        — нова сторінка адмінки
app/admin/settings/actions.ts      — server action оновлення
components/admin/SettingsForm.tsx  — клієнтська форма
components/admin/AdminNav.tsx      — оновлений (нова вкладка "Налаштування")
```

### Файли-приклади (НЕ заливаються, дивись і копіюй що потрібно)

```
examples/Header.example.tsx        — приклад async Header з БД
examples/Footer.example.tsx        — приклад async Footer з БД
```

---

## Послідовність дій

### 1. SQL у Supabase (першим!)

Supabase → SQL Editor → New query → встав `sql/site-settings.sql` → Run.

Внизу побачиш таблицю з усіма ключами (phone, email, address, telegram_url
і т.д.) зі значеннями `(пусто)` для більшості і двома заповненими
(`site_title`, `footer_about`, `copyright`, `work_hours`).

### 2. Залий код адмінки

GitHub → Add file → Upload files → перетягни:
- `lib/site-settings.ts` (новий файл)
- `app/admin/settings/` (нова папка з 2 файлами)
- `components/admin/SettingsForm.tsx` (новий)
- `components/admin/AdminNav.tsx` (⚠️ замінює існуючий — додано іконку "Налаштування")

Commit: `Block 12: site settings admin`.

⚠️ Якщо твій поточний `AdminNav.tsx` має додаткові кастомні елементи —
дивись на наш файл і додай тільки рядок з `Settings` icon в масив `NAV`,
не заміняй цілий файл.

### 3. Перевір адмінку

1. `/admin` — у сайдбарі зʼявилась нова вкладка **Налаштування** (іконка шестерні)
2. Клік → відкривається сторінка з 3 групами: Контакти / Соцмережі / Інше
3. Заповни поля: телефон, email, адресу, telegram_url (якщо є) і т.д.
4. Внизу — велика помаранчева кнопка **ЗБЕРЕГТИ ВСІ** (sticky)
5. Натисни → побачиш «Оновлено N параметрів»
6. Перезавантаж сторінку — значення збереглись

### 4. Оновлення Header/Footer на сайті

⚠️ **Це найделікатніша частина.** Я не бачив твоїх поточних `Header.tsx` і
`Footer.tsx`, тому даю **приклади** в папці `examples/`. Дивись на них і
вирішуй сам, що робити:

#### Варіант A — повна заміна (якщо твоя розмітка близька до моєї)

Скопіюй вміст `examples/Header.example.tsx` → встав у твій
`components/site/Header.tsx` → перевір що імпорт `Phone`, `Search`, `User`
тощо приходить з `lucide-react` (вже є в проєкті).

Те саме для `Footer.example.tsx` → `components/site/Footer.tsx`.

#### Варіант B — частковий патч (рекомендую)

У твоєму поточному `Header.tsx`:

**1. Зроби компонент `async`** (якщо ще не є):
```tsx
export default async function Header() {
```

**2. Додай нагорі імпорти:**
```tsx
import { createClient } from '@/lib/supabase/server';
import { getSiteSettings } from '@/lib/site-settings';
```

**3. Перед `return` додай завантаження даних:**
```tsx
const supabase = await createClient();
const [{ data: cats }, settings] = await Promise.all([
  supabase.from('categories').select('slug, name').order('sort_order'),
  getSiteSettings(),
]);
const categories = (cats ?? []) as Array<{ slug: string; name: string }>;
```

**4. Знайди місце, де у тебе хардкорний масив навігації** (щось типу
`const NAV = [{ name: 'Самокати', href: '/category/urban' }, ...]`) і
**заміни** його використання в JSX на:

```tsx
{categories.map((c) => (
  <Link key={c.slug} href={`/category/${c.slug}`}>
    {c.name}
  </Link>
))}
```

**5. Де хардкорний телефон** (`+380...`) — заміни на `{settings.phone}`.
Аналогічно для всіх інших захардкорджених контактів.

Для Footer — те саме плюс соцмережі і копірайт.

#### Якщо твій Header — `'use client'`

Server component не можна позначати `'use client'`. Якщо твій Header
використовує `useState` (наприклад для мобільного меню), розділи:

```tsx
// Header.tsx — server, тягне дані з БД
import HeaderClient from './HeaderClient';

export default async function Header() {
  const categories = ...;
  const settings = await getSiteSettings();
  return <HeaderClient categories={categories} settings={settings} />;
}
```

```tsx
// HeaderClient.tsx — 'use client', твоя поточна логіка
'use client';
export default function HeaderClient({ categories, settings }) {
  const [open, setOpen] = useState(false);
  // ... твій код ...
}
```

Якщо застрягнеш — скинь мені поточний `Header.tsx` і я зроблю патч руками.

### 5. Smoke-test усього

1. `/admin/settings` → встав свій реальний телефон і email → ЗБЕРЕГТИ
2. Відкрий головну сторінку сайту → у хедері/футері має зʼявитись твій
   телефон (з кліком `tel:`)
3. У футері — соцмережі (якщо заповнив URL-и)
4. Категорії в хедері — це твої реальні з БД (Електросамокати, Електровелосипеди,
   Аксесуари), а не legacy urban/offroad/flagship

---

## Що це закриває

✅ Контакти редагуються через адмінку без коммітів
✅ Соцмережі редагуються без коммітів
✅ Текст футера, копірайт — редагуються без коммітів
✅ Хедер і футер показують реальні категорії з БД
✅ Додаєш категорію в адмінці → вона зразу зʼявляється у навігації

---

## Опціональні фінальні чищення (не блок, просто чек-лист)

- [ ] Видалити дублікатний Vercel проєкт `kukirin-ua` (failed deploys)
- [ ] Зняти `ignoreBuildErrors: true` у `next.config.ts` і пофіксити TS errors
  чесно (для цього треба згенерувати свіжі типи: `npx supabase gen types
  typescript --project-id ssxygllbnkjoklfhdfkb > lib/types/database.ts`)
- [ ] Перенести решту 2 самокатів у Products → буде 6 моделей замість 4
- [ ] Додати favicon, opengraph image у `app/icon.tsx` і `app/opengraph-image.tsx`
- [ ] Підключити аналітику — Google Analytics або Vercel Analytics

Усе це — окремі маленькі задачі, можна робити по одній коли буде час.
