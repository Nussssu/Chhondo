export const TRACKER_STEPS = [
  { key: 'placed', label: 'Order Placed' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
];

// order_status enum (database/migrations/2024_11_19_053934_create_orders_table.php):
// pending, processed, shipped, returned, delivered, cancelled, on delivery, pending delivery, incomplete
const STEP_INDEX_BY_STATUS = {
  pending: 0,
  processed: 1,
  shipped: 2,
  'on delivery': 3,
  'pending delivery': 3,
  delivered: 4,
};

const EXCEPTION_STATUSES = ['returned', 'cancelled', 'incomplete'];

const BADGE_VARIANTS = {
  delivered: { bg: '#d4e0c8', text: '#2d4a2d' },
  shipped: { bg: '#dbeafe', text: '#1d4ed8' },
  'on delivery': { bg: '#dbeafe', text: '#1d4ed8' },
  'pending delivery': { bg: '#dbeafe', text: '#1d4ed8' },
  processed: { bg: '#efe5d0', text: '#7a5c3e' },
  pending: { bg: '#efe5d0', text: '#7a5c3e' },
  cancelled: { bg: '#fee2e2', text: '#dc2626' },
  returned: { bg: '#fee2e2', text: '#dc2626' },
  incomplete: { bg: '#e4e1e0', text: '#6d6560' },
};

export function isExceptionStatus(status) {
  return EXCEPTION_STATUSES.includes((status || '').toLowerCase());
}

export function getOrderStepIndex(status) {
  const key = (status || '').toLowerCase();
  return key in STEP_INDEX_BY_STATUS ? STEP_INDEX_BY_STATUS[key] : null;
}

export function getOrderStatusBadge(status) {
  const key = (status || '').toLowerCase();
  return BADGE_VARIANTS[key] || { bg: '#e4e1e0', text: '#6d6560' };
}
