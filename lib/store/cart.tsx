'use client';

import { useSyncExternalStore } from 'react';

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
};

type CartState = {
  items: CartItem[];
};

const STORAGE_KEY = 'kukirin-cart-v1';

// --- Singleton store ---
let state: CartState = { items: [] };
const listeners = new Set<() => void>();

function load() {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed?.items)) {
        state = { items: parsed.items };
      }
    }
  } catch {
    // ignore corrupt storage
  }
}

function persist() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota exceeded etc.
  }
}

function emit() {
  for (const l of listeners) l();
}

function setState(next: CartState) {
  state = next;
  persist();
  emit();
}

let loaded = false;
function ensureLoaded() {
  if (!loaded && typeof window !== 'undefined') {
    load();
    loaded = true;
    // Sync across tabs
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        load();
        emit();
      }
    });
  }
}

function subscribe(listener: () => void) {
  ensureLoaded();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): CartState {
  return state;
}

function getServerSnapshot(): CartState {
  return { items: [] };
}

// --- Public API ---
export function addItem(item: Omit<CartItem, 'quantity'>, quantity = 1) {
  ensureLoaded();
  const existing = state.items.find((it) => it.slug === item.slug);
  let nextItems: CartItem[];
  if (existing) {
    nextItems = state.items.map((it) =>
      it.slug === item.slug ? { ...it, quantity: it.quantity + quantity } : it,
    );
  } else {
    nextItems = [...state.items, { ...item, quantity }];
  }
  setState({ items: nextItems });
}

export function removeItem(slug: string) {
  ensureLoaded();
  setState({ items: state.items.filter((it) => it.slug !== slug) });
}

export function updateQuantity(slug: string, quantity: number) {
  ensureLoaded();
  if (quantity <= 0) {
    removeItem(slug);
    return;
  }
  setState({
    items: state.items.map((it) =>
      it.slug === slug ? { ...it, quantity } : it,
    ),
  });
}

export function clearCart() {
  ensureLoaded();
  setState({ items: [] });
}

export function useCart() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function cartTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const count = items.reduce((sum, it) => sum + it.quantity, 0);
  return { subtotal, count };
}
