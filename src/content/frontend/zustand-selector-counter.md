---
title: "Zustand 셀렉터로 필요한 상태만 구독하기"
description: "Zustand Store를 만들고 셀렉터로 count와 액션을 나누어 구독하는 카운터 실습을 정리한다."
date: "2026-09-13"
tags:
  - Frontend
  - React
  - Zustand
  - Store
  - Selector
---

# Zustand 셀렉터로 필요한 상태만 구독하기

컴포넌트 밖에 Zustand Store를 만들고, 컴포넌트에서는 필요한 상태와 액션만 선택해 사용하는 카운터를 구현했다.

## 1. Store 만들기

```ts
interface CounterStore {
  count: number
  increment: () => void
  reset: () => void
}

export const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}))
```

Store에는 숫자 상태와 증가, 초기화 액션을 함께 정의했다. `set`으로 이전 상태를 받아 새로운 `count`를 만든다.

## 2. 셀렉터로 상태 구독하기

```tsx
const count = useCounterStore((state) => state.count)
const increment = useCounterStore((state) => state.increment)
const reset = useCounterStore((state) => state.reset)
```

각 셀렉터는 Store 전체가 아니라 컴포넌트에 필요한 상태 조각이나 액션을 선택한다.

```tsx
<output>{count}</output>
<button type="button" onClick={increment}>+ 1 증가</button>
<button type="button" onClick={reset}>초기화</button>
```

## 정리

- Zustand Store는 컴포넌트 밖에서 상태와 액션을 관리한다.
- Provider 없이 Store 훅을 사용할 수 있다.
- 셀렉터로 필요한 상태 조각을 선택해 구독한다.
