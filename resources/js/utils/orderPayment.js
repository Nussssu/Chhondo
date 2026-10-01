/**
 * Labels for how an order was paid, shared by the order table and the order
 * details view so the two never describe the same order differently.
 *
 * Method labels mirror config('payments.methods').
 */
const METHOD_LABELS = {
  bkash: 'bKash', nagad: 'Nagad', rocket: 'Rocket', upay: 'Upay', mcash: 'mCash',
  surecash: 'SureCash', tap: 'Tap', card: 'Card', bank: 'Bank transfer', cheque: 'Cheque',
}

/** The short label for the table: the online method when known. */
export function paymentMethodLabel(order) {
  if (order.payment_type === 'online') {
    return METHOD_LABELS[order.payment_method] ?? 'Online'
  }
  if (order.payment_type === 'cash') return 'Cash'
  return 'COD'
}

/**
 * Which gateway took the money.
 *
 * Only a storefront checkout goes through a gateway: bKash's own checkout when
 * the method is bkash, SSLCommerz for every other online payment. An online
 * payment on a POS or manually created order was recorded by staff.
 */
export function paymentGatewayLabel(order) {
  if (order.payment_type !== 'online') {
    return order.payment_type === 'cash' ? 'Cash' : 'Cash on delivery'
  }
  if (order.order_type !== 'checkout') return 'Recorded by staff'
  return order.payment_method === 'bkash' ? 'bKash' : 'SSLCommerz'
}

const STATUS = {
  paid: { label: 'Paid', tone: 'success' },
  failed: { label: 'Failed', tone: 'danger' },
  cancelled: { label: 'Cancelled', tone: 'neutral' },
  unpaid: { label: 'Unpaid', tone: 'warning' },
}

export const paymentStatus = (order) => STATUS[order.payment_status] ?? STATUS.unpaid
