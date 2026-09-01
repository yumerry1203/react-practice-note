import type { ProductState } from '../type/product'

export function taxCalculator (state:ProductState):number {
  const trackingCode = state.productId + 100;

  return trackingCode;
}