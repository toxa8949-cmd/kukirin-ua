export const ORDER_STATUSES = [
  'new',
  'confirmed',
  'shipped',
  'completed',
  'canceled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  new: 'нове',
  confirmed: 'підтверджене',
  shipped: 'відправлене',
  completed: 'завершене',
  canceled: 'скасоване',
};
