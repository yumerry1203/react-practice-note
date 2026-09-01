/**
 * ProductState: 상품 정보의 형태를 정의하는 계약서입니다.
 */
export interface ProductState {
  productId: number; // 식별 번호는 오직 숫자만 허용
  price: number;     // 가격은 연산을 위해 숫자로 제한
}

/**
 * ProductAction: 엔진에 내릴 수 있는 유효한 명령 메뉴판입니다.
 * Union Type(|)을 사용하여 두 가지 명령으로 범위를 제한합니다.
 */
export type ProductAction = 
  | { type: 'SET_PRODUCT'; payload: number }
  | { type: 'UPDATE_PRICE'; payload: number };
