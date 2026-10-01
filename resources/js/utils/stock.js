/**
 * Availability, the way the server models it.
 *
 * Three questions, deliberately kept apart — they used to be one, which is why
 * an out-of-stock product offered a pre-order button:
 *
 *   isOutOfStock   nothing on the shelf and nothing on order — cannot be bought
 *   isPreOrder     nothing on the shelf, but orders are being taken
 *   isPurchasable  either in stock or on pre-order
 *
 * Mirrors Product::getInStockAttribute() / getIsPreorderAttribute() /
 * getPurchasableAttribute(). The API sends in_stock, is_preorder and
 * purchasable as appended attributes; the fallbacks only cover payloads built
 * before those existed, so the storefront never silently disagrees with admin.
 */

export const STOCK_IN = 'instock'
export const STOCK_OUT = 'outofstock'
export const STOCK_MANAGE = 'manage'
export const STOCK_PREORDER = 'preorder'

/** Whether this product is taking pre-orders. */
export function isPreOrder(product) {
  if (!product) return false

  if (typeof product.is_preorder === 'boolean') return product.is_preorder

  return product.stock_status === STOCK_PREORDER
}

/** Whether stock is on hand right now. Pre-orders are not. */
export function isInStock(product) {
  if (!product) return false

  if (typeof product.in_stock === 'boolean') return product.in_stock
  if (product.stock_status === STOCK_IN) return true
  if (product.stock_status === STOCK_OUT || product.stock_status === STOCK_PREORDER) return false

  // No stock_status key at all means a partial payload — something hand-built
  // a product object and left availability out. `quantity` cannot stand in for
  // it: the column is only meaningful while stock_status is 'manage', and a
  // shop that does not count stock leaves it at 0 on products that are very
  // much for sale. Reading it here marked 12 of 44 live products "Out of
  // Stock" in the Recently viewed row, because that snapshot stored quantity
  // and nothing else. Mirrors Product::getInStockAttribute(), which likewise
  // only consults quantity in its default branch.
  //
  // So: assume available and let the server be the judge. /cart/add and
  // checkout both refuse what is really unavailable, making the worst case a
  // refusal one step later rather than a storefront that cannot sell.
  if (!('stock_status' in product)) return true

  // A stock_status of null is a real row written before the column existed,
  // which is judged on quantity — unlike the absent key handled above.
  if (product.quantity === undefined || product.quantity === null) return true

  return Number(product.quantity) > 0
}

/**
 * Whether an order may be placed — what a buy button should ask.
 *
 * Note this is NOT the opposite of isOutOfStock: a pre-order is neither in
 * stock nor out of it.
 */
export function isPurchasable(product) {
  if (!product) return false

  if (typeof product.purchasable === 'boolean') return product.purchasable

  return isPreOrder(product) || isInStock(product)
}

/** Nothing on the shelf and nothing on order: the product cannot be bought. */
export function isOutOfStock(product) {
  if (!product) return true

  return !isPurchasable(product)
}

/** The note the shop wrote about when pre-ordered stock is expected. */
export function preOrderNote(product) {
  const note = String(product?.preorder_note ?? '').trim()

  return note || ''
}

/**
 * Whether the chosen combination of options cannot be sold.
 *
 * A product can be in stock overall while one of its variants is not — the
 * quantity is held per option row. Only asked of products that actually count
 * stock: for "in stock" and "pre-order" the per-row quantity is noise, the same
 * way it is on the product itself.
 *
 * @param product        the product being bought
 * @param attributeRows  the product_attributes rows the selection resolves to
 */
export function isVariantOutOfStock(product, attributeRows) {
  if (!product || !Array.isArray(attributeRows) || attributeRows.length === 0) return false

  // Mirrors Product::getTracksStockAttribute().
  const counted = ![STOCK_IN, STOCK_OUT, STOCK_PREORDER].includes(product.stock_status)

  if (!counted) return false

  return attributeRows.some(
    (row) => row && (row.status === 'disable' || Number(row.quantity ?? 0) <= 0)
  )
}

/**
 * How many units may still be sold.
 *
 * "In stock" and "pre-order" products are not counted, so they are effectively
 * unlimited — returning the quantity column there would wrongly cap the POS at
 * whatever stale number happens to sit in it.
 */
export function sellableQuantity(product) {
  if (!product) return 0

  if (product.stock_status === STOCK_IN || product.stock_status === STOCK_PREORDER) return Infinity
  if (product.stock_status === STOCK_OUT) return 0

  return Number(product.quantity ?? 0)
}
