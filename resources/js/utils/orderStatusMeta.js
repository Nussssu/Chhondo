export const STATUS_OPTIONS = ['pending', 'processed', 'on delivery', 'delivered', 'shipped', 'cancelled', 'returned', 'incomplete']

const STATUS_META = {
  pending: { btn: 'status-btn-pending', item: 'status-item-pending' },
  processed: { btn: 'status-btn-processed', item: 'status-item-processed' },
  'on delivery': { btn: 'status-btn-ondelivery', item: 'status-item-ondelivery' },
  shipped: { btn: 'status-btn-shipped', item: 'status-item-shipped' },
  delivered: { btn: 'status-btn-delivered', item: 'status-item-delivered' },
  cancelled: { btn: 'status-btn-cancelled', item: 'status-item-cancelled' },
  returned: { btn: 'status-btn-returned', item: 'status-item-returned' },
  incomplete: { btn: 'status-btn-incomplete', item: 'status-item-incomplete' },
}

export function statusMeta(status) {
  return STATUS_META[status] ?? { btn: '', item: '' }
}
