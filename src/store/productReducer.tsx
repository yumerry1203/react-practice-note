import type { ProductAction, ProductState } from '../type/product'

export function productReducer(state: ProductState, action: ProductAction): ProductState {
  switch (action.type) {
    case 'SET_PRODUCT':
      // action.payload가 number여야 한다는 계약서 내용을 근거로 검수합니다.
      // 만약 "PROD-101" 같은 문자열을 넣으면 즉시 빨간 줄이 그어집니다.
      return {
        ...state,
        productId: action.payload
      }

    case 'UPDATE_PRICE':
      return {
        ...state,
        price: action.payload
      }

    default:
      return state;
  }
}
