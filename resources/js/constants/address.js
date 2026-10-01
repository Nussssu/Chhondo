/**
 * Delivery address options.
 *
 * `CITIES` deliberately uses the same keys as the checkout's delivery area, so
 * a saved address sets the shipping zone without any translation between the
 * two screens. Mirrors AddressWebController::CITIES / ::TYPES.
 */
export const CITIES = {
  inside: 'Inside Dhaka',
  outside: 'Outside Dhaka',
}

export const TYPES = {
  home: 'Home',
  office: 'Office',
}

/** A blank address, ready to be filled in. */
export const blankAddress = () => ({
  address: '',
  city: '',
  type: 'home',
  is_default: false,
})
