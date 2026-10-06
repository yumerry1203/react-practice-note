---
title: "Zustand 슬라이스 패턴으로 스토어 분리하기"
description: "StateCreator와 import type을 사용해 도메인별 상태를 분리하고 하나의 스토어로 결합하는 방법"
date: "2026-10-06"
tags:
  - Zustand
  - Slice Pattern
  - StateCreator
---

# Zustand 슬라이스 패턴으로 스토어 분리하기

상태가 많아질수록 하나의 스토어 파일에 모든 로직을 넣기보다, 관리 영역별로 나눈 뒤 하나의 스토어로 합치는 편이 관리하기 쉽다. Zustand에서는 이 방식을 **슬라이스 패턴**으로 구현할 수 있다.

## 1. 슬라이스 패턴이 필요한 이유

슬라이스 패턴은 유저, 상품, 알림처럼 서로 다른 도메인의 상태와 액션을 파일 단위로 분리하는 방식이다. 각 슬라이스는 자신의 상태만 책임지고, 최종 스토어에서 여러 슬라이스를 합쳐 사용한다.

- 도메인별 상태와 액션을 분리할 수 있다.
- 특정 기능만 수정하거나 테스트하기 쉬워진다.
- 스토어가 커져도 파일 하나가 과도하게 복잡해지는 것을 막을 수 있다.


## 2. 전체 스토어 타입 정의

먼저 각 슬라이스의 상태와 액션, 그리고 두 슬라이스를 합친 전체 스토어 타입을 정의한다.

```ts
// src/store/types.ts

export interface CosmeticsSlice {
  perfumeStock: number;
  sellPerfume: () => void;
}

export interface ClothingSlice {
  shirtStock: number;
  sellShirt: () => void;
}

export interface DepartmentStore extends CosmeticsSlice, ClothingSlice {}
```

`CosmeticsSlice`와 `ClothingSlice`는 각 도메인이 책임질 상태와 액션을 정의한다. `DepartmentStore`는 두 타입을 확장해 최종 통합 스토어의 모양을 만든다.

## 3. StateCreator로 슬라이스 만들기

`StateCreator`는 현재 슬라이스가 전체 스토어 안에서 어떤 상태를 만들지 정의하는 타입이다.

```ts
StateCreator<전체스토어, 미들웨어, 미들웨어, 현재슬라이스>
```

미들웨어를 사용하지 않는다면 두 번째와 세 번째 제네릭에 빈 배열 `[]`을 사용한다. 첫 번째 제네릭에는 통합 스토어 타입을 넣어 다른 슬라이스 상태도 타입 추론할 수 있게 한다.

### 화장품 슬라이스

```ts
// src/store/cosmeticsSlice.ts

import type { StateCreator } from 'zustand';
import type { CosmeticsSlice, DepartmentStore } from './types';

export const createCosmeticsSlice: StateCreator<
  DepartmentStore,
  [],
  [],
  CosmeticsSlice
> = (set) => ({
  perfumeStock: 100,
  sellPerfume: () => set((state) => ({
    perfumeStock: state.perfumeStock - 1,
  })),
});
```

`set` 콜백의 `state`는 `DepartmentStore` 타입으로 추론된다. 이 슬라이스에서는 `perfumeStock`만 변경한 객체를 반환한다.

### 의류 슬라이스

```ts
// src/store/clothingSlice.ts

import type { StateCreator } from 'zustand';
import type { ClothingSlice, DepartmentStore } from './types';

export const createClothingSlice: StateCreator<
  DepartmentStore,
  [],
  [],
  ClothingSlice
> = (set) => ({
  shirtStock: 50,
  sellShirt: () => set((state) => ({
    shirtStock: state.shirtStock - 1,
  })),
});
```

두 슬라이스는 서로 다른 파일에 있어도 같은 `DepartmentStore` 타입을 기준으로 동작한다.

## 4. import type을 사용하는 이유

인터페이스와 타입은 런타임에 존재하지 않는다. 타입만 사용하는 import에는 `import type`을 사용하면 TypeScript가 해당 import를 타입 전용으로 처리한다.

```ts
import type { StateCreator } from 'zustand';
import type { CosmeticsSlice, DepartmentStore } from './types';
```

타입 전용 import를 사용하면 타입 정보와 실제 실행에 필요한 값을 구분할 수 있다.

## 5. 통합 스토어 만들기

각 슬라이스 생성 함수를 실행하고 전개 연산자로 반환 객체를 합쳐 하나의 스토어를 만든다.

```ts
// src/store/index.ts

import { create } from 'zustand';
import type { DepartmentStore } from './types';
import { createClothingSlice } from './clothingSlice';
import { createCosmeticsSlice } from './cosmeticsSlice';

export const useDepartmentStore = create<DepartmentStore>()((...a) => ({
  ...createCosmeticsSlice(...a),
  ...createClothingSlice(...a),
}));
```

`...a`에는 Zustand가 제공하는 `set`, `get`, `api`가 들어 있다. 같은 인자를 각 슬라이스에 전달하면, 분리된 슬라이스도 하나의 통합 스토어 안에서 동작한다.  
`DepartmentStore`에 `clothingSlice`와 `cosmeticsSlice`를 물리적 결합을 하는 형태

## 6. 컴포넌트에서 필요한 상태만 구독하기

컴포넌트에서는 셀렉터로 필요한 상태와 액션만 가져온다.

```tsx
import { useDepartmentStore } from './store';

export function Inventory() {
  const perfumeStock = useDepartmentStore((state) => state.perfumeStock);
  const sellPerfume = useDepartmentStore((state) => state.sellPerfume);

  return (
    <section>
      <p>향수 재고: {perfumeStock}개</p>
      <button onClick={sellPerfume}>향수 판매</button>
    </section>
  );
}
```

이 컴포넌트는 `perfumeStock`을 구독하므로, `shirtStock`만 변경될 때는 다시 렌더링되지 않는다.  
상태와 액션을 로컬 변수처럼 사용하기 때문에 가독성이 높아진다.  
-> 실제 내가 했던 프로젝트에서는 하나의 큰 store에서 slice패턴으로 작업하지 않고, 각 필요한 스토어를 만들어 사용하였다.(인증, 행사선택, 마스킹정책 등)

## 정리

- 슬라이스 패턴은 도메인별 상태와 액션을 분리하는 Zustand 스토어 구성 방식이다.
- 각 슬라이스는 자신의 타입을 정의하고, 전체 스토어 타입을 기준으로 구현한다.
- `StateCreator`는 전체 스토어와 현재 슬라이스의 타입을 연결한다.
- 타입만 가져올 때는 `import type`을 사용한다.
- 최종 스토어에서는 각 슬라이스를 전개 연산자로 합치고, 컴포넌트에서는 셀렉터로 필요한 값만 구독한다.
