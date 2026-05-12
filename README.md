# Block 9.1 — Fix "u.map is not a function"

## Що було не так

У `OrderActions.tsx` (client component) я імпортував константу-масив
`ORDER_STATUSES` з `actions.ts` (server actions, помічений `'use server'`).

Next.js дозволяє експортувати з файлу `'use server'` **тільки async функції**.
Якщо звідти експортується ще щось (масив, об'єкт), Next.js серіалізує це
як proxy. На клієнті `proxy.map(...)` падає з `TypeError: u.map is not a function`.

## Виправлення

Виніс константи в окремий файл `app/admin/orders/constants.ts` (без
`'use server'`). І `actions.ts`, і `OrderActions.tsx` тепер імпортують їх
звідти.

## Файли

```
app/admin/orders/constants.ts    — NEW (ORDER_STATUSES, ORDER_STATUS_LABEL)
app/admin/orders/actions.ts      — імпортує з constants.ts
components/admin/OrderActions.tsx — імпортує з constants.ts
```

## Як залити

GitHub → Add file → Upload files → перетягни папки `app` і `components` →
Commit: `Block 9.1: fix server-action constant export` → у `main`.

Чекай Vercel Ready (1-2 хв).

## Smoke-test

1. `/admin/orders/<id>` — має відкритись без 500
2. Зміни статус `new` → `confirmed` → ЗБЕРЕГТИ → бачиш "Статус оновлено"
3. Додай нотатку → ОК
