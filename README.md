# Block 6 — Admin Auth + Dashboard skeleton

Email/password логін через Supabase Auth, гейтинг `/admin/*`, sidebar-навігація, базовий dashboard з KPI і списком останніх замовлень.

Включає також фікс `parseNumeric` для `"2x1200W"` → `2400` (G3 Pro).

## Файли

```
app/admin/login/page.tsx         — server component сторінки логіну
app/admin/actions.ts             — signIn / signOut server actions
app/admin/layout.tsx             — server component, перевірка через is_admin()
app/admin/page.tsx               — dashboard (KPI + останні замовлення)
components/admin/LoginForm.tsx   — client форма
components/admin/AdminNav.tsx    — sidebar з активним станом + logout
lib/data/products.ts             — фікс для 2x1200W
```

## Як налаштувати після деплою

### 1. Створи admin user у Supabase

Supabase Dashboard → **Authentication** → **Users** → **Add user → Create new user**

- Email: твій email (напр. `admin@kukirin.ua` або твій реальний)
- Password: придумай і запиши (мін. 6 символів)
- ✅ Auto-confirm user (щоб не вимагало підтвердження email)

Натисни **Create user**. У списку Users скопіюй `User UID` (UUID користувача).

### 2. Додай user_id у public.admins

Supabase Dashboard → **Table Editor** → `admins` → **Insert row**

- `user_id`: встав скопійований UUID
- `created_at`: лиши default

Натисни **Save**.

Або зроби це SQL-ом:

```sql
insert into public.admins (user_id)
values ('<встав_сюди_UUID>')
on conflict (user_id) do nothing;
```

### 3. Залий цей блок

GitHub → Add file → Upload files → перетягни папки `app`, `components`, `lib` з архіву → Commit: `Block 6: admin auth + dashboard skeleton + power parse fix` → у `main`.

Чекай Vercel Ready.

### 4. Перевір вхід

1. Зайди на `https://kukirin-ua-gpbw.vercel.app/admin/login`
2. Введи email + пароль з кроку 1
3. Має зредіректити на `/admin` — побачиш дашборд

Якщо вводиш правильний email/пароль, але отримуєш «Цей акаунт не має прав адміністратора» — значить ти забув крок 2 (додати user_id в `admins`).

## Smoke-test

1. `/admin/login` без логіну → форма
2. Невірний пароль → червона помилка "Невірний email або пароль"
3. Правильний email/пароль, але user_id НЕ в `admins` → редірект назад на login з "Цей акаунт не має прав адміністратора"
4. Правильний логін + є в `admins` → редірект на `/admin`
5. `/admin` без логіну → автоматично редіректить на `/admin/login?next=/admin`
6. У `/admin` бачиш:
   - KPI плитки (Виручка, Замовлень, Середній чек, Очікують)
   - Список останніх замовлень (зокрема твій тестовий A2749686)
   - Кнопку "Вийти" в сайдбарі
7. Натиснув "Вийти" → редірект на `/admin/login`
8. Каталог працює як раніше — admin зміни нічого не зламали
9. G3 Pro на каталозі тепер показує `2400W` замість `2W`

## Безпека

- Middleware ставить редірект до того, як рендериться будь-який код сторінки.
- `/admin/layout.tsx` додатково перевіряє `is_admin()` на кожен SSR (defense-in-depth).
- Якщо хтось залогінений але НЕ в `admins` — session видаляється у `signIn` action.
- Service_role клієнт (`createAdminClient`) використовується ТІЛЬКИ всередині `/admin/*` коду, що захищений middleware + layout-перевіркою.

## Наступний крок

Block 7 — Admin Products CRUD: створення/редагування/видалення товарів + upload фото в Storage.
