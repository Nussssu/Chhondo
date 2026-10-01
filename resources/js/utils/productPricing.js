import { sellableQuantity } from '@/utils/stock'

/**
 * Price and sellable quantity for a product.
 *
 * Previously this also resolved attribute options and combinations. Product
 * variants were removed — no product ever used them — so a product now has one
 * price and one stock figure.
 */
export function rowState(product) {
  return {
    price: Number(product?.price ?? 0),
    qty: sellableQuantity(product),
    combinationId: null,
    selected: [],
  }
}
