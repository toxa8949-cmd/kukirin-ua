# Block 7 — Admin Products CRUD + stub admin tabs

## Що в цьому пакеті

### Products (повний CRUD)
- `/admin/products` — список з пошуком, мініатюрами, бейджами `off`/`feat`
- `/admin/products/new` — форма створення
- `/admin/products/[id]/edit` — форма редагування + кнопка Видалити з підтвердженням
- `/admin/products/actions.ts` — server actions (`createProduct`, `updateProduct`, `deleteProduct`, `uploadProductImage`)
- Поля: основне, ціна/склад, характеристики (специфікації структуровано), фото (URL + upload)
- Upload: натискаєш «Завантажити» → файл їде в Supabase Storage `product-images` → URL автоматично вставляється

### Stub-сторінки (щоб не було 404)
- `/admin/categories` — read-only список
- `/admin/orders` — read-only список з останніми 50 замовленнями
- `/admin/news` — read-only список новин

### Інфраструктура
- `next.config.ts` — додано `remotePatterns` для `kukirin.com.ua` і Supabase Storage
- `sql/storage-bucket.sql` — створення bucket `product-images` з public read + admin-only write

## Послідовність дій

### 1. SQL у Supabase (ДО заливки коду!)

Supabase → SQL Editor → New query → встав `sql/storage-bucket.sql` → Run.

Внизу побачиш:
- `product-images | public: true` — bucket створений
- 4 політики на `storage.objects` (read, insert, update, delete)

### 2. Залий код у репо

GitHub → Add file → Upload files → перетягни папки `app`, `components` і файл `next.config.ts` → Commit: `Block 7: products CRUD + admin tabs stub` → у `main`.

⚠️ **Перед заливкою:** перевір, що твій локальний `next.config.ts` не має додаткових налаштувань, яких немає в моєму. Якщо є — змерджи руками.

### 3. Smoke-test

1. `/admin` → дашборд
2. Тицяй на «Товари» → побачиш список 6 моделей
3. Натисни «Редагувати» на G3 Pro → відкриється форма з усіма заповненими полями
4. Поміняй tagline, збережи → побачиш «Збережено», відкрий `/product/kukirin-g3-pro` — оновлене
5. На сторінці редагування натисни «Завантажити» біля Cover URL → вибери будь-яке зображення з компʼютера → URL заповниться, мінікартинка зʼявиться → збережи → перевір на сайті
6. «Додати товар» → заповни форму → створи → відкриється сторінка редагування з повідомленням «Товар створено»
7. «Видалити» на тестовому товарі → confirm → редірект на список

### 4. Категорії / Замовлення / Новини

Це stub-и (read-only). Просто переконайся, що:
- `/admin/categories` показує 3 категорії
- `/admin/orders` показує 1 твоє замовлення A2749686
- `/admin/news` пустий, без помилки

Повний CRUD для них — Block 8/9.

## Як заповнити фото KUKIRIN з kukirin.com.ua

1. Відкрий kukirin.com.ua, знайди потрібну модель
2. Правою кнопкою на фото → «Copy image address»
3. Встав у Cover URL у формі редагування товара → Зберегти
4. Перевір на `/catalog` — фото має зʼявитись

Кілька фото — вставляй URL у блок «Додаткові фото» з нового рядка.

## Безпека

- Всі server actions перевіряють `is_admin()` перед записом — дублюємо захист середини middleware
- Upload обмежений 5 МБ і тільки `image/*` (перевіряється на клієнті, але також BUCKET-level можна додати)
- Storage bucket — public read (так треба для `<img src>`), запис — тільки адміни (через `is_admin()` в storage policies)
- `service_role` ніколи не йде в браузер — тільки в server actions

## Чого ще немає

- Drag-and-drop сортування `product_images` (вони впорядковуються по черзі введення URL)
- Drag-and-drop reorder для категорій
- Bulk-операції (масове редагування)
- Це все можна додати пізніше якщо знадобиться

## Наступний крок

**Block 8** — Categories + News CRUD (аналогічні формі товара, простіше).
