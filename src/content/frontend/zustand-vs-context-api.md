---
title: "Context API와 Zustand 상태 관리 비교"
description: "Context API의 한계와 Zustand를 사용했을 때 편리한 점을 기록했다."
date: "2026-09-13"
tags:
  - Zustand
  - Context API
  - State Management
  - Selector
---


## 1. Zustand 설치

Zustand는 별도 Provider 없이 Store 훅을 만들고 사용할 수 있는 **상태 관리** 라이브러리다.

```bash
npm install zustand
```

## 2. Context API의 한계

상태를 여러 단계 아래의 컴포넌트로 전달할 때는 프롭 드릴링이 생길 수 있다. Context API를 사용하면 중간 컴포넌트가 props를 전달하지 않아도 되지만, Context 값이 바뀌면 그 Context를 구독하는 컴포넌트가 영향을 받을 수 있다.

숫자 상태 하나를 전역으로 관리하는 Context API 예시는 다음과 같다.

```tsx
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

interface CounterState {
  count: number
  increment: () => void
}

const CounterContext = createContext<CounterState | null>(null)

export function CounterProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0)
  const increment = useCallback(() => setCount((previous) => previous + 1), [])
  const value = useMemo(() => ({ count, increment }), [count, increment])

  return <CounterContext.Provider value={value}>{children}</CounterContext.Provider>
}

export function useCounter() {
  const context = useContext(CounterContext)

  if (!context) {
    throw new Error('CounterProvider 내부에서만 사용 가능합니다.')
  }

  return context
}
```

이 방식에서는 상태 타입, Context, Provider, 커스텀 훅을 함께 작성한다.  
`useCallback`과 `useMemo`는 값과 함수의 참조를 안정적으로 유지할 때 사용한다. 또한 Provider 밖에서 훅을 사용하지 않도록 확인해야 한다.  
불필요한 리렌더링이 생기지 않게 복잡한 과정을 거쳐야한다. 

## 3. Zustand Store와 셀렉터

Zustand는 리액트 컴포넌트 트리 밖에 Store를 만들고, 컴포넌트에서 필요한 값만 선택한다.

```ts
import { create } from 'zustand'

interface CounterStore {
  count: number
  increment: () => void
}

export const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))
```

컴포넌트에서는 셀렉터로 필요한 상태를 선택한다.

```tsx
function CounterDisplay() {
  const count = useCounterStore((state) => state.count)

  return <h1>현재 숫자: {count}</h1>
}
```

`(state) => state.count`처럼 셀렉터를 사용하면 `count` 값이 바뀔 때 이 값을 구독하는 컴포넌트가 업데이트된다. Store 안의 다른 상태가 바뀌더라도 선택한 값이 변하지 않으면 해당 컴포넌트는 다시 렌더링할 필요가 없다.

## 4. Context API와 Zustand 선택하기

Zustand가 항상 Context API를 대체하는 것은 아니다. 상태의 성격과 갱신 빈도에 맞춰 선택한다.

- **Zustand**: 사용자 정보, 장바구니처럼 앱 여러 곳에서 사용하고 자주 바뀌는 비즈니스 상태에 사용한다. (전역)
- **Context API**: 다크 모드, 다국어 설정처럼 비교적 변경이 적거나 특정 컴포넌트 트리에만 주입할 값에 사용한다. 

## 정리

- Context API는 props 전달 단계를 줄일 수 있지만, Context 값의 변경 범위와 Provider 구조를 함께 고려해야 한다.
- Zustand는 `create`로 Store를 만들고 Provider 없이 사용할 수 있다.
- 셀렉터는 Store 전체가 아닌 필요한 상태 조각만 선택할 수 있다. ->Selector 패턴
- 전역으로 자주 변경되는 상태는 Zustand, 지역적이거나 변경이 적은 설정 값은 Context API에 적합할 수 있다.
