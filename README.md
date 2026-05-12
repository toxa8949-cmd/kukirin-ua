# Block 6.1 — Fix ERR_TOO_MANY_REDIRECTS

## Що було не так

Block 6 додавав redirect-логіку у трьох місцях:
1. `lib/supabase/middleware.ts` (вже існував раніше)
2. `app/admin/layout.tsx` (нове)
3. `app/admin/login/page.tsx` (нове)

Cookies оновлюються між запитами не миттєво, тому коли middleware виставив
session cookie, а layout читає той самий cookie на наступному redirect-у —
вони могли бачити різні стани і відбивати один в одного. Звідси
`ERR_TOO_MANY_REDIRECTS`.

## Виправлення

**Middleware — єдина точка контролю доступу до `/admin/*`.**
Layout і login сторінка більше НЕ роблять redirect — просто рендерять.

## Файли

```
lib/supabase/middleware.ts   — оновлений: вся логіка тут
app/admin/layout.tsx         — без redirect, тільки рендер
app/admin/login/page.tsx     — без redirect, тільки рендер
```

## Як залити

1. Розпакуй ZIP
2. GitHub → Add file → Upload files → перетягни папки `app` і `lib`
   (вони змерджаться поверх існуючих)
3. Commit: `Block 6.1: fix /admin redirect loop`
4. Чекай Vercel Ready (1-2 хв)

## Як перевірити

1. **Очисти cookies** для `kukirin-ua-gpbw.vercel.app`
   (правою кнопкою на `i` біля URL → Cookies → Видалити)
2. Відкрий **інкогніто-вкладку**: `/admin/login`
3. Має зʼявитися форма
4. Введи `toxa8949@gmail.com` + пароль (той, що ставив при створенні user-а)
5. Має зредіректити на `/admin` з дашбордом

Якщо знову loop — кинь скрін з DevTools → Network, де видно ланцюжок
редіректів (статуси 307/308). Це покаже, з якого URL на який летить.
