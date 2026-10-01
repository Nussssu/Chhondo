/**
 * The price a customer actually pays for a product.
 *
 * Mirrors the server: Product::getDiscountedPriceAttribute() applies the best
 * coupon attached to that product, and the cart charges the same figure. A
 * campaign discount is applied on top of the same base, and the customer gets
 * whichever single reduction is larger — never both.
 *
 * Everything reads this so a price shown on a card, a product page and the cart
 * cannot disagree.
 */
export function campaignDiscountFor(product) {
  const data = product?.product_campaign
    ?? (product?.pivot ? { ...product.pivot, campaign: product.campaign ?? null } : null)

  if (!data) return 0

  const raw = data.discount ?? data.campaign?.discount ?? null
  if (!raw) return 0

  const base = Number(product?.price) || 0

  if (typeof raw === 'string' && raw.includes('%')) {
    return (base * parseFloat(raw.replace('%', ''))) / 100
  }

  return Number.isNaN(Number(raw)) ? 0 : Number(raw)
}

/** Discount in currency, from whichever source gives the most off. */
export function discountFor(product) {
  const coupon = Number(product?.discount_amount) || 0
  const campaign = campaignDiscountFor(product)
  const base = Number(product?.price) || 0

  return Math.min(Math.max(coupon, campaign), base)
}

/**
 * The list price pair for the blouse choice in play.
 *
 * A saree with the blouse option carries two pairs, not one price and a spare:
 * without-blouse is (previous_price, price) and with-blouse is
 * (previous_price_with_blouse, price_with_blouse). Reading them through here is
 * what keeps the figure shown and the figure struck through describing the same
 * variant.
 */
export function listPricesFor(product, withBlouse = false) {
  if (withBlouse) {
    const sale = Number(product?.price_with_blouse) || 0
    const regular = Number(product?.previous_price_with_blouse) || 0

    // The sale half is optional. Priced only at its regular price, the option
    // still sells — at that price, with nothing struck through.
    return sale > 0
      ? { price: sale, previous: regular }
      : { price: regular, previous: 0 }
  }

  return {
    price: Number(product?.price) || 0,
    previous: Number(product?.previous_price) || 0,
  }
}

/**
 * What the with-blouse option costs, or 0 when it carries no price at all.
 *
 * Mirrors Product::getBlousePriceAttribute(), which is what the cart charges.
 */
export function blousePriceFor(product) {
  return listPricesFor(product, true).price
}

/**
 * What the customer pays for a given base amount.
 *
 * `amount` is whatever the current selection resolves to — the with- or
 * without-blouse price, plus any attribute option prices on top. The coupon or
 * campaign reduction comes off that, so the figure on screen is the one the
 * cart will charge.
 */
export function priceForAmount(product, amount) {
  const base = Number(amount) || 0
  return Math.max(0, Math.round((base - discountFor(product)) * 100) / 100)
}

/** What the customer pays for the product as listed. */
export function priceFor(product, withBlouse = false) {
  return priceForAmount(product, listPricesFor(product, withBlouse).price)
}

/** The struck-through price, or null when there is nothing to strike. */
export function wasPriceFor(product, withBlouse = false) {
  const { price: base, previous } = listPricesFor(product, withBlouse)

  // A coupon or campaign strikes the list price it reduced; otherwise the
  // "was" price is whatever was typed, and only when it is actually higher.
  if (discountFor(product) > 0) return base || null
  return previous > base ? previous : null
}

export function discountPercentFor(product, withBlouse = false) {
  const was = wasPriceFor(product, withBlouse)
  if (!was) return 0
  return Math.round(((was - priceFor(product, withBlouse)) / was) * 100)
}
