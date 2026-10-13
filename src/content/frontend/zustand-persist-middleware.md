---
title: "Zustand Persist로 새로고침 이후 상태 유지하기"
description: "수동 localStorage 관리의 한계와 Zustand persist 미들웨어로 전역 상태를 저장·복구하는 방법을 정리했다."
date: "2026-10-13"
tags:
  - Zustand
  - Persist
  - localStorage
  - State Management
---

# Zustand Persist로 새로고침 이후 상태 유지하기

일반적인 전역 상태는 브라우저를 새로고침하면 초기값으로 돌아간다. 장바구니처럼 새로고침 뒤에도 유지해야 하는 상태는 저장소에 기록하고 다시 복구해야 한다. 이 과정을 직접 구현하는 방식과 Zustand Persist 미들웨어를 비교해 본다.

## 1. localStorage를 직접 관리하는 방식

`localStorage`에는 문자열만 저장할 수 있다. 배열이나 객체를 저장하려면 `JSON.stringify`로 문자열로 바꾸고, 다시 사용할 때는 `JSON.parse`로 복구해야 한다.

```tsx
// src/components/ManualStorage.tsx

import { useEffect, useState } from 'react';

export function ManualStorage() {
  const [cart, setCart] = useState<string[]>(() => {
    const saved = localStorage.getItem('my-cart');

    try {
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('데이터 복구 중 오류 발생:', error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('my-cart', JSON.stringify(cart));
  }, [cart]);

  const addItem = (item: string) => setCart((currentCart) => [...currentCart, item]);

  return (
    <section>
      <p>담긴 물건: {cart.join(', ') || '비어 있음'}</p>
      <button onClick={() => addItem('사과')}>사과 추가</button>
    </section>
  );
}
```

지연 초기화 함수에서 저장값을 한 번 읽고, `useEffect`에서 상태가 바뀔 때마다 저장한다. 동작은 가능하지만 저장이 필요한 상태마다 비슷한 코드가 반복된다.

## 2. 수동 관리의 한계

### 직렬화와 역직렬화 반복

저장할 때는 `JSON.stringify`, 읽을 때는 `JSON.parse`가 필요하다. 상태가 여러 개로 늘어나면 이 흐름과 오류 처리를 반복해서 작성하게 된다.

### 런타임 데이터 검증 필요

`JSON.parse` 결과는 저장된 값의 구조가 현재 타입과 일치하는지 보장하지 않는다. 저장된 데이터가 손상되었거나 이전 버전 구조라면, 배열이어야 할 값이 다른 형태일 수 있다. 실제 서비스에서는 읽어 온 값을 검증하거나 안전한 기본값으로 되돌리는 처리가 필요하다.

### 브라우저 환경 의존성

`localStorage`는 브라우저에서만 사용할 수 있다. 서버 렌더링 환경에서는 저장소 접근 시점과 화면 하이드레이션 시점을 별도로 고려해야 한다.

## 3. Zustand Persist 미들웨어

Zustand의 `persist` 미들웨어는 스토어 상태를 저장소에 기록하고, 앱 시작 시 저장값을 다시 병합하는 흐름을 제공한다. 기본 저장소는 `localStorage`이며 `name`은 저장소에서 사용할 고유 키이다.

```ts
// src/store/useCartStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartStore {
  cart: string[];
  addItem: (item: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],
      addItem: (item) => set((state) => ({
        cart: [...state.cart, item],
      })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'my-cart',
    },
  ),
);
```

이제 `cart`가 바뀌면 Persist 미들웨어가 저장하고, 새로고침 뒤에는 저장된 상태를 다시 불러와 초기 상태와 병합한다.

## 4. 저장할 상태만 고르기

스토어의 모든 값을 저장할 필요는 없다. `partialize`로 저장할 상태만 선택할 수 있다.

```ts
interface CartUiStore {
  cart: string[];
  isModalOpen: boolean;
  addItem: (item: string) => void;
}

export const useCartUiStore = create<CartUiStore>()(
  persist(
    (set) => ({
      cart: [],
      isModalOpen: false,
      addItem: (item) => set((state) => ({
        cart: [...state.cart, item],
      })),
    }),
    {
      name: 'my-cart',
      partialize: (state) => ({ cart: state.cart }),
    },
  ),
)
```

장바구니 데이터는 저장하고, 일시적인 모달 열림 상태는 저장하지 않는 방식으로 구분할 수 있다.

## 5. 저장소 변경과 하이드레이션

`createJSONStorage`를 사용하면 `sessionStorage`처럼 다른 저장소를 설정할 수 있다.

```ts
import { createJSONStorage, persist } from 'zustand/middleware';

persist(
  (set) => ({ count: 0 }),
  {
    name: 'temporary-count',
    storage: createJSONStorage(() => sessionStorage),
  },
)
```

SSR 환경에서는 저장된 브라우저 상태와 서버가 만든 초기 화면이 달라 하이드레이션 경고가 생길 수 있다. 이 경우 `skipHydration`으로 자동 복구를 건너뛰고, 클라이언트가 마운트된 뒤 `rehydrate()`를 호출하는 흐름을 사용할 수 있다.

```tsx
useEffect(() => {
  useCartStore.persist.rehydrate();
}, []);
```

`persist`가 JSON 데이터의 형태를 자동으로 검증해 주는 것은 아니다. 저장 데이터가 신뢰할 수 없거나 구조가 바뀔 수 있다면 `merge`, `migrate`, 사용자 정의 저장소 또는 스키마 검증을 함께 고려한다.

## 6. 수동 관리와 Persist 비교

| 구분 | 수동 localStorage 관리 | Zustand Persist |
| --- | --- | --- |
| 저장·복구 코드 | `useState`, `useEffect`, JSON 처리 코드를 직접 작성한다. | 미들웨어 설정으로 저장·복구 흐름을 연결한다. |
| 저장소 변경 | 각 접근 코드를 수정해야 한다. | `storage` 설정을 바꿔 저장소를 교체할 수 있다. |
| 저장 범위 | 상태마다 저장 로직을 작성한다. | `partialize`로 저장할 필드를 선택한다. |
| 데이터 검증 | 직접 검증해야 한다. | Persist도 기본 JSON 저장소에서는 직접 검증이 필요하다. |
| SSR 대응 | 접근 시점과 화면 차이를 직접 관리한다. | 지연 저장소 접근과 `skipHydration` 옵션을 활용할 수 있다. |

## 정리

- 전역 상태는 새로고침하면 초기화되므로 유지가 필요한 값은 저장소에 기록해야 한다.
- 수동 관리에서는 직렬화, 오류 처리, 복구 코드가 상태마다 반복된다.
- Zustand Persist는 스토어의 저장과 복구를 미들웨어로 연결한다.
- `partialize`로 저장할 상태만 선택하고, 필요하면 다른 저장소로 바꿀 수 있다.
- Persist를 사용해도 저장 데이터의 런타임 검증과 SSR 하이드레이션 문제는 상황에 맞게 처리해야 한다.
