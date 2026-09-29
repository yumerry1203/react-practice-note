---
title: "TypeScript로 리듀서 데이터 흐름 제한하기"
description: "ProductState와 ProductAction을 정의해 리듀서와 계산 함수의 데이터 흐름을 타입으로 제한하는 방법을 정리한다."
date: "2026-09-01"
tags:
  - TypeScript
  - useReducer
  - Union Type
  - Migration
---

# TypeScript로 리듀서 데이터 흐름 제한하기

상품 상태, 리듀서 액션, 계산 함수에 타입을 적용해 잘못된 데이터와 명령을 컴파일 단계에서 확인하도록 구성했다.

## 1. 상태와 액션 타입 정의하기

```ts
interface ProductState {
  productId: number
  price: number
}

type ProductAction =
  | { type: 'SET_PRODUCT'; payload: number }
  | { type: 'UPDATE_PRICE'; payload: number }
```

`ProductState`는 상품 정보의 형태를 정의한다. `ProductAction`은 리듀서가 받을 수 있는 명령과 값의 타입을 제한한다.

## 2. 타입이 적용된 리듀서 만들기

```ts
function productReducer(
  state: ProductState,
  action: ProductAction,
): ProductState {
  switch (action.type) {
    case 'SET_PRODUCT':
      return { ...state, productId: action.payload }
    case 'UPDATE_PRICE':
      return { ...state, price: action.payload }
    default:
      return state
  }
}
```

액션 이름의 오타나 숫자가 아닌 `payload`는 타입 검사에서 확인할 수 있다.

## 3. 계산 함수와 연결하기

```ts
function taxCalculator(state: ProductState): number {
  return state.productId + 100
}
```

초기 `productId`가 `101`이면 계산된 추적 코드는 `201`이 된다. 계산 함수는 `ProductState`만 받으므로 숫자 연산에 필요한 형태가 유지된다.

## 정리

- 인터페이스로 상태 데이터의 형태를 제한한다.
- Union Type으로 처리할 수 있는 액션을 제한한다.
- `useReducer`와 계산 함수가 같은 상태 타입을 공유한다.
